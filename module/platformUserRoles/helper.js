const platformRolesHelper = require(ROOT_PATH + "/module/platformRoles/helper")
let sunBirdService =
    require(ROOT_PATH + "/generics/services/sunbird");

module.exports = class platformUserRolesHelper {

    static getProfile(queryObject) {
        return new Promise(async (resolve, reject) => {
            try {

                let platformUserRolesDocument = await database.models.platformUserRolesExt.findOne(
                    queryObject,
                    {
                        updatedBy: 0,
                        createdBy: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        status: 0,
                        deleted: 0,
                        userId: 0,
                        "__v": 0
                    }
                ).lean();

                if(platformUserRolesDocument){
                    platformUserRolesDocument.roles = platformUserRolesDocument.roles.map(role=> role.code)
                }

                return resolve(platformUserRolesDocument);

            } catch (error) {
                return reject(error);
            }
        })

    }

    static bulkCreateOrUpdate(userRolesCSVData, userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                let userRolesUploadedData = new Array

                const userRolesArray = await platformRolesHelper.list({
                    status: "active"
                }, {
                    code: 1,
                    title: 1
                });

                let userRoleMap = {}

                userRolesArray.forEach(userRole => {
                    userRoleMap[userRole.code] = {
                        roleId: userRole._id,
                        code: userRole.code,
                    }
                })

                let actions = {
                    "ADD": 1,
                    "APPEND": 1,
                    "REMOVE": 1,
                    "OVERRIDE": 1
                }

                let userToKeycloakIdMap = {}
                let userKeycloakId = ""
                let userRole
                let existingUserRole
                const keycloakUserIdIsMandatoryInFile = (process.env.DISABLE_LEARNER_SERVICE_ON_OFF && process.env.DISABLE_LEARNER_SERVICE_ON_OFF == "ON") ? true : false

                for (let csvRowNumber = 0; csvRowNumber < userRolesCSVData.length; csvRowNumber++) {

                    userRole = gen.utils.valueParser(userRolesCSVData[csvRowNumber]);
                    userRole["_SYSTEM_ID"] = ""

                    try {

                        if (!userRoleMap[userRole.code]) throw "Invalid role code."

                        if (!actions[userRole.action]) throw "Invalid action."

                        if (userToKeycloakIdMap[userRole.user]) {
                            userKeycloakId = userToKeycloakIdMap[userRole.user]
                        } else {
                            if (keycloakUserIdIsMandatoryInFile) {
                                if (!userRole["keycloak-userId"] || userRole["keycloak-userId"] == "") {
                                    throw "Keycloak user ID is mandatory."
                                }
                                userKeycloakId = userRole["keycloak-userId"]
                                userToKeycloakIdMap[userRole.user] = userRole["keycloak-userId"]
                            } else {
                                let keycloakUserId = await shikshalokamGenericHelper.getKeycloakUserIdByLoginId(userDetails.userToken, userRole.user)

                                if (keycloakUserId && keycloakUserId.length > 0 && keycloakUserId[0].userLoginId) {
                                    userKeycloakId = keycloakUserId[0].userLoginId
                                    userToKeycloakIdMap[userRole.user] = keycloakUserId[0].userLoginId
                                } else {
                                    throw "User entity id."
                                }
                            }
                        }

                        existingUserRole = await database.models.platformUserRolesExt.findOne(
                            {
                                userId: userKeycloakId
                            },
                            {
                                roles: 1
                            }
                        );

                        if (existingUserRole && existingUserRole._id) {

                            let userRoleToUpdate

                            if (existingUserRole.roles && existingUserRole.roles.length > 0) {
                                userRoleToUpdate = _.findIndex(existingUserRole.roles, { 'code': userRole.code });
                            }

                            if (userRole.action == "OVERRIDE") {
                                existingUserRole.roles[userRoleToUpdate] = userRoleMap[userRole.code]
                            } else if (userRole.action == "APPEND" || userRole.action == "ADD") {
                                if (!(userRoleToUpdate >= 0)) {
                                    existingUserRole.roles.push(userRoleMap[userRole.code])
                                }
                            } else if (userRole.action == "REMOVE") {
                                userRoleToUpdate = _.findIndex(existingUserRole.roles, { 'code': userRole.code })
                                _.pullAt(existingUserRole.roles, userRoleToUpdate);
                            }

                            await database.models.platformUserRolesExt.findOneAndUpdate(
                                {
                                    _id: existingUserRole._id
                                },
                                _.merge({
                                    "roles": existingUserRole.roles,
                                    "updatedBy": userDetails.id
                                }, _.omit(userRole, ["username", "userId", "createdBy", "updatedBy", "createdAt", "updatedAt"]))
                            );

                            userRole["_SYSTEM_ID"] = existingUserRole._id
                            userRole.status = "Success"

                        } else {

                            let roles = [userRoleMap[userRole.code]]

                            let newRole = await database.models.platformUserRolesExt.create(
                                _.merge({
                                    "roles": roles,
                                    "userId": userKeycloakId,
                                    "username": userRole.user,
                                    "status": "active",
                                    "updatedBy": userDetails.id,
                                    "createdBy": userDetails.id
                                }, _.omit(userRole, ["username", "userId", "createdBy", "updatedBy", "createdAt", "updatedAt", "status", "roles"]))
                            );

                            if (newRole._id) {
                                userRole["_SYSTEM_ID"] = newRole._id
                                userRole.status = "Success"
                            } else {
                                userRole["_SYSTEM_ID"] = ""
                                userRole.status = "Failed to create the user role."
                            }

                        }

                    } catch (error) {
                        userRole.status = (error && error.message) ? error.message : error
                    }


                    userRolesUploadedData.push(userRole)
                }


                return resolve(userRolesUploadedData);

            } catch (error) {
                return reject(error)
            }
        })

    }

    
    static create(request, token) {

        return new Promise(async (resolve, reject) => {
            try {

                let response = await sunBirdService.createUser(request.body, request.userDetails.userToken);

                if (response && response.responseCode == "OK") {

                    let userObj = {
                        channel: messageConstants.apiResponses.SUNBIRD_CHANNEL,
                        createdBy: new Date,
                        updatedBy: new Date,
                        status: messageConstants.common.ACTIVE,
                        userName: request.body.userName,
                        userId: response.result.userId,
                        isDeleted: false
                    }

                    delete request.body.userName;
                    userObj["metaInformation"] = request.body;

                    let db = await database.models.platformUserRolesExt.create(userObj);
                    
                    return resolve({ result: response.result, message: messageConstants.apiResponses.USER_CREATED });
                } else {
                    return resolve({ result: response });
                }

            } catch (error) {
                return reject(error)
            }
        })
    }

};