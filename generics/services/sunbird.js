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
  * @returns {Promise}
*/

var createUser = async function (requestBody, token) {

    const createUserUrl =
        process.env.SUNBIRD_URL + messageConstants.endpoints.SUNBIRD_CREATE_USER;

    return new Promise(async (resolve, reject) => {

        let jsonObject = {
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            phoneNumber: requestBody.phoneNumber,
            userName: requestBody.userName,
            password: requestBody.password,
            gender: requestBody.gender
        }

        if (requestBody.email) {
            jsonObject['email'] = requestBody.email;
            jsonObject['emailVerified'] = true;
        }
        if (requestBody.phoneNumber) {
            jsonObject['phone'] = requestBody.phoneNumber;
            jsonObject['phoneVerified'] = true;
        }

        let response = await callToSunbird(token,jsonObject,createUserUrl);
        return resolve(response);
    })

}


/**
  * add user to organisation
  * @function
  * @name createUser
  * @param requestBody - body data for creating user.
  * @param token - Logged in user token.
  * @returns {Promise}
*/

var addUserToOrganisation = async function (requestBody, token) {

    const adduserToOrgUrl =
        process.env.SUNBIRD_URL + messageConstants.endpoints.SUNBIRD_ADD_USER_TO_ORG;

    return new Promise(async (resolve, reject) => {

        let response = await callToSunbird(token,requestBody,adduserToOrgUrl);
        return resolve(response);
    })

}



/**
  * update user
  * @function
  * @name updateUser
  * @param requestBody - body data for update user.
  * @param token - Logged in user token.
  * @returns {Promise}
*/

var updateUser = async function (requestBody, token) {


    return new Promise(async (resolve, reject) => {


    })

}


function callToSunbird(token,requestBody,url) {

    return new Promise(async (resolve, reject) => {
        let options = {
            "headers": {
                "content-type": "application/json",
                "authorization": process.env.AUTHORIZATION,
                "x-authenticated-user-token": token,
            },
            json: { request: requestBody }
        };

        request.post(url, options, callback);

        function callback(err, data) {
            if (err) {
                return reject({
                    message: messageConstants.apiResponses.SUNBIRD_SERVICE_DOWN
                });
            } else {
                let response = data.body;
                return resolve(response);
            }
        }

    });
}



module.exports = {
    createUser: createUser,
    addUserToOrganisation: addUserToOrganisation,
    updateUser: updateUser
};