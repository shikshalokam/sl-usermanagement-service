/**
 * name : kendra.js
 * author : Priyanka
 * Date : 17-Nov-2020
 * Description : All kendra service related information.
 */

//dependencies

const request = require('request');
const kendraServiceBaseURL = process.env.KENDRA_APPLICATION_ENDPOINT + "/";

/**
  * create entry in Activity Log.
  * @function
  * @name addToActivityLog
  * @param {Object} data - data
  * @param {String} type - type of doc ex: entity, user.
  * @param {String} userId - user id.
  * @param {String} docId - doc id.
  * @returns {JSON} Activity Log.
*/

const addToActivityLog = function (type,userId,docId,data) {

    let addToActivityUrl = kendraServiceBaseURL + CONSTANTS.endpoints.ADD_TO_ACTIVITY_LOG + "?type=" + type + "&userId=" + userId + "&docId=" + docId ;
    console.log(addToActivityUrl,"addToActivityUrl")
    return new Promise((resolve, reject) => {
        try {

            const kendraCallBack = function (err, response) {
                if (err) {
                    return reject({
                        status : httpStatusCode.bad_request.status,
                        message : CONSTANTS.apiResponses.KENDRA_SERVICE_DOWN
                    })
                } else {
                    let activityDetails =  response.body
                    return resolve(activityDetails);
                }
            }

            request.post(addToActivityUrl, {
                headers: {
                    "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
                },
                json : data
            }, kendraCallBack);

        } catch (error) {
            return reject(error);
        }
    })
}


module.exports = {
    addToActivityLog: addToActivityLog
};