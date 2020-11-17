let sunbirdService =
    require(GENERIC_SERVICES_PATH + "/sunbird");

let platformRolesHelper = require(MODULES_BASE_PATH + "/platformRoles/helper");
const kendraService = require(PROJECT_ROOT_DIRECTORY + "/generics/services/kendra");

/**
* user related information be here.
* @method
* @class  UserExtensionHelper
*/

module.exports = class UserExtensionHelper {


    /**
    * To get user profile details
    * @method
    * @name  getProfile
    * @param {String}  userId - Logged in user details.
    * @param {String} token - user access token.
    * @returns {json} Response consists of user profile details.
    */
    static getProfile(userId, token) {
        return new Promise(async (resolve, reject) => {
            try {

                let queryObject = {
                    userId: userId,
                    status: CONSTANTS.common.ACTIVE
                }
                let profileData = await sunbirdService.getUserProfile(token, userId);
                let roles;
                profileData = JSON.parse(profileData);
               
                if (profileData.status != HTTP_STATUS_CODE.ok.status) {
                    
                    throw new Error(CONSTANTS.apiResponses.USER_PROFILE_NOT_FOUND);
                }

                if (profileData.result &&
                    profileData.result.response
                ) {
                    if (profileData.result.response.roles) {
                        roles = profileData.result.response.roles;
                    }
                    await Promise.all(profileData.result.response.organisations.map(orgInfo => {
                        if (orgInfo.roles) {
                            roles.push(...orgInfo.roles);
                        }
                    }))
                }


                if (roles) {
                    roles = Array.from(new Set(roles));
                }

                let userExtDocument = await database.models.userExtension.findOne(
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

                if (userExtDocument) {
                    userExtDocument.roles = userExtDocument.roles.map(role => role.code)
                    if (roles) {
                        userExtDocument.roles.push(...roles);
                    }
                }
                return resolve(userExtDocument);

            } catch (error) {
                return reject({
                    success: false,
                    message: error.message ? error.message : HTTP_STATUS_CODE["internal_server_error"].message,
                    data: false
                });
            }
        })

    }


    /**
 * reate a new user.
 * @method
 * @name  create
 * @param {String} request - consist of new user details
 * @param {String} token - user access token
 * @param {String} userId  - logged in userId.
 * @returns {json} Response consists of created user details.
 */
    static create(request, token, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                    let response = await sunbirdService.createUser(request, token);
                  
                    if (response && response.status == HTTP_STATUS_CODE.ok.status) {

                        let rolesId = [];
                        let organisationsRoles = [];
                        let plaformRoles = [];
                        let rolesDocuments = await platformRolesHelper.list({ }, {
                            code: 1
                        });
                        plaformRoles.push(CONSTANTS.common.PUBLIC_ROLE);
                        await Promise.all(request.roles.map(async function (roleInfo) {

                            let roleObj = {
                                code: roleInfo.value,
                                name: roleInfo.label
                            }
                            rolesId.push(roleObj);
                            let found = rolesDocuments.filter(customRoles=>{
                                return customRoles.code==roleInfo.value;
                            });
                           
                            if (found && found.length == 0) {
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
                        let addUserToOrg = await sunbirdService.addUserToOrganisation(orgRequest, token);

                        let userObj = {
                            channel: process.env.SUNBIRD_CHANNEL,
                            status: CONSTANTS.common.ACTIVE,
                            externalId: request.userName,
                            userId: response.result.userId,
                            isDeleted: false,
                            // roles: allRoles,
                            organisations: request.organisation,
                            organisationRoles: organisationsRoles,
                            createdAt: new Date,
                            updatedAt: new Date,
                            createdBy: userId,
                            updatedBy: userId
                        }

                        let metaInformation = {
                            email: request.email ? request.email : "",
                            state: request.state ? request.state : "",
                            firstName: request.firstName,
                            lastName: request.lastName,
                            phoneNumber: request.phoneNumber ? request.phoneNumber : "",
                            dateOfBirth: request.dateOfBirth ? request.dateOfBirth : ""
                        }

                        userObj["metaInformation"] = metaInformation;
                        let db = await database.models.userExtension.create(userObj);
                        if(db != ""){
                            let addToActivityLog = await kendraService.addToActivityLog("user-create","PANJAB_MIS",db._id,db);
                        }
                        
                        return resolve({ result: response.result, message: CONSTANTS.apiResponses.USER_CREATED });
                    } else {

                        throw new Error(response.message);
                    }
                
            } catch (error) {
                return reject({
                    success: false,
                    message: error.message ? error.message : HTTP_STATUS_CODE["internal_server_error"].message,
                    data: false
                });
            }
        })
    }

    /**
    * To activate the user
    * @method
    * @name  activate
    * @param {String} userId  - keyclock user id
    * @param {String} token - user access token   
    * @returns {json} Response consists of success or failure of the api.
    */
    static activate(userId, token) {
        return new Promise(async (resolve, reject) => {
            try {

                let response = await sunbirdService.activateUser(userId, token);
                if (response && response.status == HTTP_STATUS_CODE.ok.status) {

                    let status = CONSTANTS.common.ACTIVE;
                    let updateStatus = await database.models.userExtension.findOneAndUpdate({ userId: userId }, { $set: { status: status } });
                    let message = CONSTANTS.apiResponses.USER_UNBLOCKED;
                    resolve({ result: response.result, message: message });
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                return reject({
                    success: false,
                    message: error.message ? error.message : HTTP_STATUS_CODE["internal_server_error"].message,
                    data: false
                });
            }
        });
    }

    /**
     * To inactivate the user
     * @method
     * @name  inactivate
     * @param {String} userId  - keyclock user id
     * @param {String} token - user access token   
     * @returns {json} Response consists of success or failure of the api.
     */
    static inactivate(userId, token) {
        return new Promise(async (resolve, reject) => {
            try {

                let response = await sunbirdService.inactivateUser(userId, token);
                if (response && response.status == HTTP_STATUS_CODE.ok.status) {

                    let status = CONSTANTS.common.INACTIVE;
                    let updateStatus = await database.models.userExtension.findOneAndUpdate({ userId: userId }, { $set: { status: status } });

                    let message = CONSTANTS.apiResponses.USER_BLOCKED;
                    resolve({ result: response.result, message: message });
                } else {
                    throw new Error(response.message );
                }
            } catch (error) {
                return reject({
                    success: false,
                    message: error.message ? error.message : HTTP_STATUS_CODE["internal_server_error"].message,
                    data: false
                });
            }
        });
    }
}