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

                let platformUsers = this.buildCSVToDocument(userRolesCSVData)

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
                            if (userRole.action == "APPEND") {
                                updateObject["$addToSet"] = {
                                    roles: {
                                        roleId: ObjectId(userRole.roleId),
                                        code: userRole.code
                                    }
                                }
                                updateObject["$set"] = {
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            } else if (userRole.action == "OVERRIDE") {
                                updateObject["$set"] = {
                                    "roles.$.roleId": ObjectId(userRole.roleId),
                                    "roles.$.code": userRole.code,
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            } else if (userRole.action == "REMOVE") {
                                updateObject["$pull"] = {
                                    roles: {
                                        roleId: ObjectId(userRole.roleId)
                                    }
                                }
                                updateObject["$set"] = {
                                    "updatedBy": userDetails.id,
                                    "updatedAt": new Date()
                                }
                            }


                            let updateRole = await database.models.platformUserRolesExt.findOneAndUpdate(
                                {
                                    "userId": userRole.userId,
                                    "roles.roleId": ObjectId(userRole.roleId)
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
                            if(error.message && error.message.includes("Cannot read property '_id' of null")){
                                userRole.status = "Role not found to modify"  
                            }else{
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

        let userRoles = {}

        userRolesCSVData.forEach(userRole => {

            if (userRoles[userRole.userId]) {

                let roleExists = false
                userRoles[userRole.userId].roles.find(role => {
                    if (role.roleId.toString() == userRole.roleId.toString()) roleExists = true
                })

                if (!roleExists) {

                    userRoles[userRole.userId].roles.push({
                        "roleId": ObjectId(userRole.roleId),
                        "code": userRole.code
                    })

                }

            } else {

                userRoles[userRole.userId] = {
                    "roles": [{
                        "roleId": ObjectId(userRole.roleId),
                        "code": userRole.code
                    }],
                    "status": "active",
                    "userId": userRole.userId,
                    "username": userRole.username,
                }

            }

        });

        return Object.values(userRoles)

    }


};