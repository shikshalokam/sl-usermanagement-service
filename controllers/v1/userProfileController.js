/**
 * name : userProfileController.js
 * author : Aman
 * Date : 10-feb-2019
 * Description : All user profile related information.
 */

// Dependencies
const userProfileHelper = require(ROOT_PATH + "/module/userProfile/helper");

module.exports = class UserProfile extends Abstract {

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


  constructor() {
    super(userProfileSchema);
  }

  static get name() {
    return "userProfile";
  }


    /**
  * @api {post} /user-management-service/api/v1/userProfile/create 
  * @apiVersion 1.0.0
    * @apiName Create user profile.
  * @apiGroup Platform User Role Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management-service/api/v1/userProfile/create
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Requests:
  * {
  *   "firstName" : "abc",
  *   "lastName" : "xyz",
  *   "emailId" : "abc@gmail.com",
  *   "phoneNumber" : 1234567890,
  *   "state" : "",
  *   "district" : "",
  *   "block" : "",
  *   "zone" : "",
  *   "cluster" : "",
  *   "taluk" : "",
  *   "hub" : "",
  *   "school" : "",
  *   "userId" : ""
    }
  */

  /**
   * Create user profile.
   * @method
   * @name update
   * @param  {Request}  req  request body.
   * @returns {json} Response consists of create user profile information.
   */

  async create(req) {
    return new Promise(async (resolve, reject) => {

    try {

      req.body["createdBy"] = req.userDetails.userId;

      let result = await userProfileHelper.create(
        req.body
      );

      return resolve(result);

    } catch (error) {
      return reject({
          status: error.status || httpStatusCode["internal_server_error"].status,

          message: 
          error.message || httpStatusCode["internal_server_error"].message,

          errorObject: error
      });

    }

  })
  }

  /**
  * @api {post} /user-management-service/api/v1/userProfile/update 
  * @apiVersion 1.0.0
  * @apiName Update user profile details
  * @apiGroup Platform User Role Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management-service/api/v1/userProfile/update
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Requests:
  * {
  *   "firstName" : "abc",
  *   "lastName" : "xyz",
  *   "emailId" : "abc@gmail.com",
  *   "phoneNumber" : 1234567890,
  *   "state" : "",
  *   "district" : "",
  *   "block" : "",
  *   "zone" : "",
  *   "cluster" : "",
  *   "taluk" : "",
  *   "hub" : "",
  *   "school" : ""
    }
  */

  /**
   * Update user profile information
   * @method
   * @name update
   * @param  {Request}  req  request body.
   * @returns {json} Response consists of updated user profile information.
   */

 update(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await userProfileHelper.update(
          req.body,
          req.userDetails.userId
        );

        return resolve(result);

      } catch (error) {
        return reject({
            status: 
            error.status || httpStatusCode["internal_server_error"].status,

            message: 
            error.message || httpStatusCode["internal_server_error"].message,

            errorObject: error
        });

      }

    })
 }

   /**
  * @api {post} /user-management-service/api/v1/userProfile/verify/:userId 
  * @apiVersion 1.0.0
  * @apiName Verify user profile details
  * @apiGroup Platform User Role Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management-service/api/v1/userProfile/verify/:userId
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Verify user profile information
   * @method
   * @name verify
   * @param  {Request}  req  request body.
   * @returns {json} Response consists of verified user profile information.
   */

  verify(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await userProfileHelper.verify(
          req.params._id
        );

        return resolve(result);

      } catch (error) {
        return reject({
            status: 
            error.status || httpStatusCode["internal_server_error"].status,

            message: 
            error.message || httpStatusCode["internal_server_error"].message,

            errorObject: error
        });

      }

    })
 }

   /**
   * Send as in-app notifications for updating user profile information.
   * @method
   * @name verify
   * @param  {Request}  req  request body.
   * @returns {json} Response consists of verified user profile information.
   */

  inAppUserProfileNotifications(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await userProfileHelper.inAppUserProfileNotifications();

        return resolve(result);

      } catch (error) {
        return reject({
            status: 
            error.status || httpStatusCode["internal_server_error"].status,

            message: 
            error.message || httpStatusCode["internal_server_error"].message,

            errorObject: error
        });

      }

    })
 }

};
