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

var createUser = async function ( requestBody,token ) {

    const createUserUrl = 
    process.env.sunbird_url+messageConstants.endpoints.SUNBIRD_CREATE_USER;

    return new Promise(async (resolve,reject)=>{
        
        let options = {
            "headers":{
            "content-type": "application/json",
            "authorization" :  process.env.AUTHORIZATION,
            "x-authenticated-user-token" : token,
            "x-channel-id" : messageConstants.common.SUNBIRD_ORGANISATION_ID 
            },
            json : { request : requestBody }
        };
        
        request.post(createUserUrl,options,callback);
        
        function callback(err,data){
            if( err ) {
                return reject({
                    message : constants.apiResponses.SUNBIRD_SERVICE_DOWN
                });
            } else {
                let dialCodeData = data.body;
                return resolve(dialCodeData);
            }
        }
    })
    
}



module.exports = {
    createUser : createUser
};