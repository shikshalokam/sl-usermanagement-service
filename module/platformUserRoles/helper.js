const platformRolesHelper = require(ROOT_PATH + "/module/platformRoles/helper")

module.exports = class platformUserRolesHelper {

    static list(filterQueryObject, projectionQueryObject) {
        return new Promise(async (resolve, reject) => {
            try {

                let platformUserRolesData = await database.models.platformUserRolesExt.find(filterQueryObject, projectionQueryObject).lean();

                return resolve(platformUserRolesData);

            } catch (error) {
                return reject(error);
            }
        })

    }

    static bulkCreate(userRolesCSVData, userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                let platformUsers = await this.buildCSVToDocument(userRolesCSVData)

                const userRolesUploadedData = await Promise.all(
                    platformUsers.map(async userRole => {

                        try {

                            let newRole = await database.models.platformUserRolesExt.create(
                                _.merge({
                                    "status": "active",
                                    "updatedBy": userDetails.id,
                                    "createdBy": userDetails.id
                                }, userRole)
                            );

                            delete userRole.entityTypes

                            userRole["action"] = "APPEND"
                            if (newRole._id) {
                                userRole["_SYSTEM_ID"] = newRole._id
                                userRole.status = "Success"
                            } else {
                                userRole["_SYSTEM_ID"] = ""
                                userRole.status = "Failed"
                            }

                        } catch (error) {
                            userRole["_SYSTEM_ID"] = ""
                            if (error.message && error.message.includes("duplicate key")) {
                                userRole.status = "Failed. Duplication occured"
                            } else {
                                userRole.status = (error && error.message) ? error.message : error
                            }
                        }


                        return userRole
                    })
                )


                return resolve(userRolesUploadedData);

            } catch (error) {
                return reject(error)
            }
        })

    }


    static bulkUpdate(userRolesCSVData, userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                const userRolesUploadedData = await Promise.all(
                    userRolesCSVData.map(async userRole => {

                        try {

                            let updateObject = {}
                            if (userRole.action == "APPEND" || userRole.action == "ADD") {
                                updateObject["$addToSet"] = {
                                    roles: userRole.code
                                }
                                updateObject["$set"] = {
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            } else if (userRole.action == "OVERRIDE") {
                                updateObject["$set"] = {
                                    "roles": [userRole.code],
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            } else if (userRole.action == "REMOVE") {
                                updateObject["$pull"] = {
                                    roles: userRole.code
                                }
                                updateObject["$set"] = {
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            }


                            let updateRole = await database.models.platformUserRolesExt.findOneAndUpdate(
                                {
                                    "userId": userRole["keycloak-userId"],
                                    "roles": userRole.code
                                },
                                updateObject
                            );

                            delete userRole.entityTypes

                            if (updateRole._id) {
                                userRole["_SYSTEM_ID"] = updateRole._id
                                userRole.status = "Success"
                            } else {
                                userRole["_SYSTEM_ID"] = ""
                                userRole.status = "Failed"
                            }

                        } catch (error) {
                            userRole["_SYSTEM_ID"] = ""
                            if (error.message && error.message.includes("Cannot read property '_id' of null")) {
                                userRole.status = "Role not found to modify"
                            } else {
                                userRole.status = (error && error.message) ? error.message : error
                            }
                        }


                        return userRole
                    })
                )


                return resolve(userRolesUploadedData);

            } catch (error) {
                return reject(error)
            }
        })

    }

    static buildCSVToDocument(userRolesCSVData) {

        return new Promise(async (resolve, reject) => {
            try {

                let userRoles = {}

                userRolesCSVData.forEach(userRole => {

                    if (userRoles[userRole["keycloak-userId"]]) {

                        if (!userRoles[userRole["keycloak-userId"]].roles.includes(userRole.code)) userRoles[userRole["keycloak-userId"]].roles.push(userRole.code)

                    } else {

                        userRoles[userRole["keycloak-userId"]] = {
                            "roles": [userRole.code],
                            "status": "active",
                            "userId": userRole["keycloak-userId"],
                            "username": userRole.user,
                        }

                    }

                });

                return resolve(Object.values(userRoles))

            } catch (error) {

                return reject(error)

            }
        })

    }


};