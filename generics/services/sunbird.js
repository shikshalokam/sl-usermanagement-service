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

        const createUserUrl =
        process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_CREATE_USER;
        
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

        const adduserToOrgUrl =
        process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_ADD_USER_TO_ORG;

        let response = await callToSunbird("POST",adduserToOrgUrl,token,requestBody,"organisation_api");
        return resolve(response);
    })

}



/**
  * update user
  * @function
  * @name updateUser
  * @param requestBody - body data for update user.
  * @param token - Logged in user token.
  * @returns {json} - Response consists of updated user details
*/

const updateUser = async function (requestBody, token) {
    return new Promise(async (resolve, reject) => {

        const updateUserApiUrl =
            process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_UPDATE_USER;

        let response = await callToSunbird("PATCH",updateUserApiUrl,token,requestBody);
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

function callToSunbird(requestType,url,token,requestBody ="",auth="") {

    return new Promise(async (resolve, reject) => {

        let authorizationCode = process.env.AUTHORIZATION;
        if(auth=="organisation_api"){
            authorizationCode = process.env.SUNBIRD_API_AUTHORIZATION
        }

        let options = {
            "headers": {
                "content-type": "application/json",
                "authorization": authorizationCode,
                "x-authenticated-user-token": token
            }
        };
        

        if (requestType != "GET") {
            options['json'] = { request: requestBody };
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
                    message: constants.apiResponses.SUNBIRD_SERVICE_DOWN
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

        const getProfileApiUrl =
        process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_USER_READ + "/" + userId;

        let response = await callToSunbird("GET",getProfileApiUrl,token);
        return resolve(response);
        
    })
}


/**
  * To inactivate the user
  * @function
  * @name inactivate
  * @param userId -  user Id of the user.
  * @param token - Logged in user token.
  * @returns {JSON} - response consist of success or failure of the api.
*/

const inactivate = function (userId, token) {
    return new Promise(async (resolve, reject) => {

        let inActivateUserAPI = process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_BLOCK_USER;

        let requestBody = {
            userId: userId
        }
        let response = await callToSunbird("POST",inActivateUserAPI,token,requestBody);
        return resolve(response);

    })
}

/**
  * To activate the user
  * @function
  * @name activate
  * @param userId -  user Id of the user.
  * @param token - Logged in user token.
  * @returns {JSON} - response consist of success or failure of the api.
*/

const activate = function (userId, token) {
    return new Promise(async (resolve, reject) => {

        let activateUserAPI = process.env.SUNBIRD_URL + constants.apiEndpoints.SUNBIRD_UNBLOCK_USER;
        let requestBody = {
            userId: userId
        }
        let response = await callToSunbird("POST",activateUserAPI,token,requestBody);
        return resolve(response);

    })
}





module.exports = {
    createUser: createUser,
    addUserToOrganisation: addUserToOrganisation,
    updateUser: updateUser,
    getUserProfile: getUserProfile,
    activate: activate,
    inactivate: inactivate
};