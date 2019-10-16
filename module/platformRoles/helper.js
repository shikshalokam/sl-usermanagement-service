module.exports = class platformUserRolesHelper {

    static list(filterQueryObject, projectionQueryObject) {
        return new Promise(async (resolve, reject) => {
            try {

                let platformUserRolesData = await database.models.platformRolesExt.find(filterQueryObject,projectionQueryObject).lean();

                return resolve(platformUserRolesData);

            } catch (error) {
                return reject(error);
            }
        })


    }

    static bulkCreate(userRolesCSVData,userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                const userRolesUploadedData = await Promise.all(
                    userRolesCSVData.map(async userRole => {

                        try {
                            
                            userRole = gen.utils.valueParser(userRole)

                            let newRole = await database.models.platformRolesExt.create(
                                _.merge({
                                    "status" : "active",
                                    "updatedBy": userDetails.id || "",
                                    "createdBy": userDetails.id || ""
                                },userRole)
                            );

                            if (newRole._id) {
                                userRole["_SYSTEM_ID"] = newRole._id 
                                userRole.status = "Success"
                            } else {
                                userRole["_SYSTEM_ID"] = ""
                                userRole.status = "Failed"
                            }

                        } catch (error) {
                            userRole["_SYSTEM_ID"] = ""
                            if(error.message && error.message.includes("duplicate key")){
                                userRole.status = "code already exists"
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


    static bulkUpdate(userRolesCSVData,userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                const userRolesUploadedData = await Promise.all(
                    userRolesCSVData.map(async userRole => {

                        try {

                            let updateRole = await database.models.platformRolesExt.findOneAndUpdate(
                                {
                                    code : userRole.code
                                },
                                _.merge({
                                    "updatedBy": userDetails.id
                                },userRole)
                            );
                            
                            if (updateRole._id) {
                                userRole["_SYSTEM_ID"] = updateRole._id 
                                userRole.status = "Success"
                            } else {
                                userRole["_SYSTEM_ID"] = ""
                                userRole.status = "Failed"
                            }

                        } catch (error) {
                            userRole["_SYSTEM_ID"] = ""
                            userRole.status = (error && error.message) ? error.message : error
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

};