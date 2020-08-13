/**
 * name : sunbird.js
 * author : Rakesh Kumar
 * Date : 18-march-2020
 * Description : All sunbird service related information.
 */

//dependencies

const request = require('request');

/**
  * create user
  * @function
  * @name createUser
  * @param requestBody - body data for creating user.
  * @param token - Logged in user token.
  * @returns {json} response consist of created user details
*/

const createUser = async function (userInputData, token) {
    return new Promise(async (resolve, reject) => {

        const createUserUrl = CONSTANTS.endpoints.SUNBIRD_CREATE_USER;
        
        let createUser = {
            firstName: userInputData.firstName,
            lastName: userInputData.lastName,
            phoneNumber: userInputData.phoneNumber,
            userName: userInputData.userName,
            password: userInputData.password,
            gender: userInputData.gender ? userInputData.gender.value : ""
        }

        if (userInputData.dateOfBirth) {
            createUser['dob'] = userInputData.dateOfBirth;
        }

        if (userInputData.email) {
            createUser['email'] = userInputData.email;
            createUser['emailVerified'] = true;
        }
        if (userInputData.phoneNumber) {
            createUser['phone'] = userInputData.phoneNumber;
            createUser['phoneVerified'] = true;
        }
        if (userInputData.address) {
            createUser['address'] = [{
                "addressLine1": address,
                "city": address
            }]
        }

        let response = await callToSunbird("POST",createUserUrl,token,createUser);
        return resolve(response);
    })

}


/**
  * Add user to organisation
  * @function
  * @name addUserToOrganisation
  * @param requestBody - body data for creating user.
  * @param token - Logged in user token.
  * @returns {json} response consist of sunbird api response details 
*/

const addUserToOrganisation = async function (requestBody, token) {
    return new Promise(async (resolve, reject) => {

        const addUserToOrgAPIEndpoint = CONSTANTS.endpoints.SUNBIRD_ADD_USER_TO_ORG;

        let response = await callToSunbird("POST",addUserToOrgAPIEndpoint,token,requestBody);
        return resolve(response);
    })

}

/**
  * Call to sunbird api's. 
  * @function
  * @name callToSunbird
  * @param requestBody - Logged in user Id.
  * @param token - Logged in user token.
  * @param url - url of the api call.
  * @param requestType - http request method
  * @returns {JSON} - user profile information.
*/

function callToSunbird(requestType, url, token = "",requestBody ="") {

    return new Promise(async (resolve, reject) => {

        let options = {
            "headers": {
                "content-type": "application/json",
                "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
            }
        };

        if(token != "") {
            options['headers']["X-authenticated-user-token"] = token;
        }
      

        url = process.env.SUNBIRD_SERIVCE_HOST + process.env.SUNBIRD_SERIVCE_BASE_URL + url;

       
        if (requestType != "GET") {
            options['json'] =  requestBody;
        }

        if (requestType == "PATCH") {
            request.patch(url, options, callback);
        } else if (requestType == "GET") {
            request.get(url, options, callback);
        } else {
            request.post(url, options, callback);
        }
        function callback(err, data) {
            if (err) {
                return reject({
                    message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN
                });
            } else {
                let response = data.body;
                return resolve(response);
            }
        }

    });
}


/**
  * Get the user profile information.
  * @function
  * @name getUserProfile
  * @param userId -  user Id of the user.
  * @param token - Logged in user token.
  * @returns {JSON} - user profile information.
*/

const getUserProfile = function (token, userId) {
    return new Promise(async (resolve, reject) => {

        const getProfileApiUrl = CONSTANTS.endpoints.SUNBIRD_USER_READ + "/" + userId;
        let response = await callToSunbird("GET",getProfileApiUrl,token);
        return resolve(response);
        
    })
}


/**
  * To inactivate a user
  * @function
  * @name inactivateUser
  * @param userId -  keycloak user Id.
  * @param token - Logged in user token.
  * @returns {JSON} - response consist of success or failure of the api.
*/

const inactivateUser = function (userId, token) {
    return new Promise(async (resolve, reject) => {

        let inActivateUserAPI = CONSTANTS.endpoints.SUNBIRD_BLOCK_USER;

        let requestBody = {
            userId: userId
        }
        let response = await callToSunbird("POST",inActivateUserAPI,token,requestBody);
        return resolve(response);

    })
}

/**
  * To activate a user
  * @function
  * @name activateUser
  * @param userId -  keycloak user Id.
  * @param token - Logged in user token.
  * @returns {JSON} - response consist of success or failure of the api.
*/

const activateUser = function (userId, token) {
    return new Promise(async (resolve, reject) => {

        let activateUserAPI = CONSTANTS.endpoints.SUNBIRD_UNBLOCK_USER;
        let requestBody = {
            userId: userId
        }
        let response = await callToSunbird("POST",activateUserAPI,token,requestBody);
        return resolve(response);

    })
}
/**
  * To check user token is valid or not
  * @function
  * @name verifyToken
  * @param token - user token for verification 
  * @returns {JSON} - consist of token verification details
*/
const verifyToken = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const verifyTokenEndpoint = CONSTANTS.endpoints.VERIFY_TOKEN;

            let requestBody = {
                token: token
            }
            let response = await callToSunbird("POST", verifyTokenEndpoint, "",requestBody);
            return resolve(response);
        } catch (error) {

            reject({ message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN });
        }
    })
}




module.exports = {
    createUser: createUser,
    addUserToOrganisation: addUserToOrganisation,
    getUserProfile: getUserProfile,
    activateUser: activateUser,
    inactivateUser: inactivateUser,
    verifyToken: verifyToken
};