/**
 * name : userExtension.js
 * author : Rakesh Kumar
 * created-date : 19-march-2020
 * Description  User related information.
 */


/**
 * dependencies
 * 
 */
const userExtensionHelper = require(ROOT_PATH + "/module/userExtension/helper");



/**
    * UserExtension
    * @class
*/



module.exports = class UserExtension extends Abstract {

    constructor() {
        super(userExtensionSchema);
   
    }

    /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

    /**
     * @apiDefine successBody
     *  @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */


    static get name() {
        return "userExtension";
    }



      /**
  * @api {get} /user-management/api/v1/userExtension/getProfile/{{userId}} Get user profile
  * @apiVersion 1.0.0
  * @apiName Get user profile
  * @apiGroup User Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management/api/v1/userExtension/getProfile/e97b5582-471c-4649-8401-3cc4249359bb
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
      "_id": "5da6e08f436f9f3cd80b57b9",
      "roles": [
          {
              "roleId": "5da580c746b88419104d8728",
              "code": "OBS_DESIGNER"
          },
          {
              "roleId": "5da580dc46b88419104d8737",
              "code": "OBS_REVIEWERS"
          }
      ],
      "updatedBy": "e97b5582-471c-4649-8401-3cc4249359bb",
      "createdBy": "e97b5582-471c-4649-8401-3cc4249359bb",
      "userId": "e97b5582-471c-4649-8401-3cc4249359bb",
      "username": "a1",
  * }
  */

  getProfile(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userId =  (req.params._id && req.params._id != "") ? req.params._id : req.userDetails.userId;
        let platformUserRolesDocument = await userExtensionHelper.getProfile(userId,req.userDetails.userToken);
        return resolve({
          message: constants.apiResponses.USER_PROFILE,
          result: platformUserRolesDocument
        });

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }

    })
  }


    /**
  * @api {post} /user-management/api/v1/userExtension/create add User
  * @apiVersion 1.0.0
  * @apiName Create User 
  * @apiGroup User Extension
  * @apiParam {reqeuestBody} consist of body of the request
  * @apiSampleRequest /user-management/api/v1/userExtension/create
  * {
  *   "firstName":"test",
  *   "lastName":"test",
  *   "email":"testUser12333@gmail.com",
  *   "phoneNumber":"1234567890",
  *   "userName":"testUser33@1234",
  *   "state":{
  *      "label":"Karnataka",
  *      "value":"5d6609ef81a57a6173a79e7a"
  *   },
  *   "organisation":{
  *      "label":"ShikshaLokamDev",
  *      "value":"0125747659358699520"
  *    },
	*  "roles":[
  *   {
  *      "label":"ORG_ADMIN",
  *      "value":"ORG_ADMIN"
  *   }
  *  ],
  * "dateofbirth":"1994-0-01"
  * }
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * 
  * {
  *   "message": "User created successfully",
  *   "status": 200,
  *    "result": [ 
  *     {  
  *         "response": "SUCCESS",
  *         "userId": ""
  *     }
  *  ]
  * }
  */

  create(req) {
    return new Promise(async (resolve, reject) => {

      try {
        let userCreate = await userExtensionHelper.create(req.body,req.userDetails.userToken,req.userDetails.userId);
        return resolve(userCreate);

      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }
    })
  }


   /**
   * @api {post} /user-management/api/v1/userExtension/activate
   * @apiVersion 1.0.0
   * @apiName To activate user
   * @apiGroup User Extension
   * @apiParam {reqeuestBody} consist of body of the request
   * @apiSampleRequest /user-management/api/v1/userExtension/activate
   * {
   *   userId:""
   * }
   * @apiUse successBody
   * @apiUse errorBody
   * @apiSampleResponse
   * {
   *    "message": "User activated successfully",
   *    "status": 200,
   *    "result": {
   *      "response": "SUCCESS"
   *    }
   * }
   */
  activate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userBlockInfo = await userExtensionHelper.activate(req.body.userId, req.userDetails.userToken);
        return resolve(userBlockInfo);

      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }
    })
  }

  /**
   * @api {post} /user-management/api/v1/userExtension/inactivate
   * @apiVersion 1.0.0
   * @apiName To inactivate user
   * @apiGroup User Extension
   * @apiParam {reqeuestBody} consist of body of the request
   * @apiSampleRequest /user-management/api/v1/userExtension/inactivate
   * {
   *   userId:""
   * }
   * @apiUse successBody
   * @apiUse errorBody
   * @apiSampleResponse
   * {
   *    "message": "User deactivated successfully",
   *    "status": 200,
   *    "result": {
   *      "response": "SUCCESS"
   *    }
   * }
   */
  inactivate(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let userBlockInfo = await userExtensionHelper.inactivate(req.body.userId, req.userDetails.userToken);
        return resolve(userBlockInfo);

      } catch (error) {
        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }
    })
  }

}