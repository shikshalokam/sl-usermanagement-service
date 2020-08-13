/**
 * name : constants/api-endpoints.js
 * author : Rakesh Kumar
 * Date : 18-March-2020
 * Description : All service endpoints
 */

module.exports = {
    SUNBIRD_CREATE_USER: "api/v1/users/create",
    SUNBIRD_ADD_USER_TO_ORG: "api/v1/users/addUserToOrganisation",
    SUNBIRD_USER_READ: "api/v1/users/getProfile",
    SUNBIRD_BLOCK_USER: "api/v1/users/inactivate",
    SUNBIRD_UNBLOCK_USER: "api/v1/users/activate",
    VERIFY_TOKEN: "api/v1/token/verify"
}