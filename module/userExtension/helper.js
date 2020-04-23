
let sunBirdService =
    require(ROOT_PATH + "/generics/services/sunbird");

/**
* user related information be here.
* @method
* @class  userExtensionHelper
*/
module.exports = class userExtensionHelper {



    /**
 * create.
 * @method
 * @name  create
 * @param  {request, token}  - requested body and token.
 * @returns {json} Response consists of created user details.
 */
    static create(request, token, userId) {

        return new Promise(async (resolve, reject) => {
            try {

                let response = await sunBirdService.createUser(request, token);

                if (response && response.responseCode == "OK") {


                    let rolesId = [];
                    let organisationsRoles = [];
                    let plaformRoles = [];
                    let allRoles = [];


                    let rolesDocuments = await database.models.platformRolesExt.find({}, {
                        _id: 1, code: 1, title: 1
                    }).lean();


                    await Promise.all(request.roles.map(async function (roleInfo) {

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
                        "organisationId": request.organisation.value,
                        "roles": plaformRoles
                    }

                    organisationsRoles.push({ organisationId: request.organisation.value, roles: rolesId });
                    let addUserToOrg = await sunBirdService.addUserToOrganisation(orgRequest, token);

                    console.log(plaformRoles, "addUserToOrg", addUserToOrg);
                    let userObj = {
                        channel: process.env.SUNBIRD_CHANNEL,
                        status: messageConstants.common.ACTIVE,
                        externalId: request.userName,
                        userId: response.result.userId,
                        isDeleted: false,
                        roles: allRoles,
                        organisations: request.organisation,
                        organisationRoles: organisationsRoles,
                        createdAt: new Date,
                        updatedAt: new Date,
                        createdBy: userId,
                        updatedBy: userId
                    }


                    if (request.confirmPassword) {
                        delete request.confirmPassword;
                    }
                    delete request.userName;
                    delete request.organisations;
                    delete request.roles;

                    delete request.password;
                    userObj["metaInformation"] = request;
                    let db = await database.models.userExtension.create(userObj);

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
   * block.
   * @method
   * @name  block
   * @param  {userId, token}  - block userId and token.
   * @returns {json} Response consists of success or failure of the api.
   */
    static block(userId, token) {

        return new Promise(async (resolve, reject) => {
            try {

                let response = await sunBirdService.blockUser(userId, token);

                if (response && response.responseCode == "OK") {
                    resolve({ result: response.result, message: messageConstants.apiResponses.USER_BLOCKED });
                } else {
                    reject({ message: response });
                }

            } catch (error) {
                return reject(error)
            }

        });
    }

}