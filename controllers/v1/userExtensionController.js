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
const userExtensionHelper = require(ROOT_PATH + "/module/userExtension/helper")



/**
    * userExtension
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
  * @api {post} /user-management-service/api/v1/userExtension/create add User
  * @apiVersion 1.0.0
  * @apiName Create User 
  * @apiGroup Platform User Role Extension
  * @apiParam {reqeuestBody} consist of body of the request
  * @apiSampleRequest /user-management-service/api/v1/userExtension/Create
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

  Create(req) {
    return new Promise(async (resolve, reject) => {

      try {
        let userCreate = await userExtensionHelper.create(req.body,req.userDetails.userToken,req.userDetails.userId);
        return resolve(userCreate);

      } catch (error) {
        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }
    })
  }


   /**
   * @api {post} /user-management-service/api/v1/userExtension/block
   * @apiVersion 1.0.0
   * @apiName block user 
   * @apiGroup User Extension
   * @apiParam {reqeuestBody} consist of body of the request
   * @apiSampleRequest /user-management-service/api/v1/userExtension/block
   * @apiUse successBody
   * @apiUse errorBody
   */
  block(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userBlockInfo = await userExtensionHelper.block(req.body.userId, req.userDetails.userToken);
        return resolve(userBlockInfo);

      } catch (error) {
        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })
      }
    })
  }

}