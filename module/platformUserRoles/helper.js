const platformRolesHelper = require(ROOT_PATH + "/module/platformRoles/helper")
let sunBirdService =
    require(ROOT_PATH + "/generics/services/sunbird");

module.exports = class platformUserRolesHelper {

    static getProfile(queryObject, token) {
        return new Promise(async (resolve, reject) => {
            try {

                let profileData = await sunBirdService.getUserProfileInfo(token, queryObject.userId);
                let roles;
                profileData = JSON.parse(profileData);
                if (profileData.responseCode == "OK") {
                    if (profileData.result &&
                        profileData.result.response &&
                        profileData.result.response.roles) {

                        roles = profileData.result.response.roles
                    }
                }

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

                if (platformUserRolesDocument) {
                    platformUserRolesDocument.roles = platformUserRolesDocument.roles.map(role => role.code)
                    if(roles){
                        platformUserRolesDocument.roles.push(...roles);
                    }
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

    /**
   * create.
   * @method
   * @name  create
   * @param  {request, token}  - requested body and token.
   * @returns {json} Response consists of created user details.
   */
    static create(request, token) {

        return new Promise(async (resolve, reject) => {
            try {

                let body = request.body;
                let token = request.userDetails.userToken;

                let response = await sunBirdService.createUser(body, token);

                if (response && response.responseCode == "OK") {


                    let rolesId = [];
                    let organisationsRoles = [];
                    let plaformRoles = [];
                    let allRoles = [];


                    let rolesDocuments = await database.models.platformRolesExt.find({}, {
                        _id: 1, code: 1, title: 1
                    }).lean();


                    await Promise.all(request.body.roles.map(async function (roleInfo) {

                        let found = false;
                        await Promise.all(rolesDocuments.map(roleDoc => {
                            if (roleDoc.code === roleInfo.value) {
                                found = true;
                                let roleObj = {
                                    roleId: roleDoc._id,
                                    code: roleDoc.code,
                                    name: roleDoc.title
                                }
                                rolesId.push(roleObj);

                                allRoles.push({ roleId: roleDoc._id, code: roleDoc.code });
                            }
                        }));

                        if (!found) {
                            if (roleInfo.value) {
                                plaformRoles.push(roleInfo.value);
                            }
                        }
                    }));

                    let orgRequest = {
                        "userId": response.result.userId,
                        "organisationId": request.body.organisation.value,
                        "roles": plaformRoles
                    }

                    organisationsRoles.push({ organisationId: request.body.organisation.value, roles: rolesId });
                    let addUserToOrg = await sunBirdService.addUserToOrganisation(orgRequest, token);

                    console.log("addUserToOrg",addUserToOrg);
                    let userObj = {
                        channel: process.env.SUNBIRD_CHANNEL,
                        status: messageConstants.common.ACTIVE,
                        username: request.body.userName,
                        userId: response.result.userId,
                        isDeleted: false,
                        roles: allRoles,
                        organisations: request.body.organisation,
                        organisationRoles: organisationsRoles,
                        createdAt: new Date,
                        updatedAt: new Date,
                        createdBy: request.userDetails.userId,
                        updatedBy: request.userDetails.userId
                    }


                    if (request.body.confirmPassword) {
                        delete request.body.confirmPassword;
                    }
                    delete request.body.userName;
                    delete request.body.organisations;
                    delete request.body.roles;

                    delete request.body.password;
                    userObj["metaInformation"] = request.body;
                    let db = await database.models.platformUserRolesExt.create(userObj);

                    return resolve({ result: response.result, message: messageConstants.apiResponses.USER_CREATED });
                } else {

                    return reject({ message: response });
                }

            } catch (error) {
                return reject(error)
            }
        })
    }


    /**
   * update.
   * @method
   * @name  update
   * @param  {requestedData}  - requested body.
   * @returns {json} Response consists of updated user details.
   */
    static update(requestedData, token) {

        return new Promise(async (resolve, reject) => {

            try {

                let body = request.body;

                let response = await sunBirdService.updateUser(body, token);


            } catch (error) {
                return reject(error)
            }
        })
    }



};