const punjabSSOHelper = require(ROOT_PATH + "/module/punjabSSO/helper")

module.exports = class PunjabSSO {
  
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
  }

  static get name() {
    return "punjabSSO";
  }

  /**
  * @api {post} /user-management/api/v1/punjabSSO/staffLogin Punjab Staff Login
  * @apiVersion 1.0.0
  * @apiName Punjab Staff Login
  * @apiGroup Punjab SSO
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management/api/v1/punjabSSO/staffLogin
  * @apiParamExample {json} Request-Body:
  * 
  *   {
  *       "staffID" : "123123123"
  *       "password" : "123123123"
  *   }
  *
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  *  "result": [
        {
            "_id": "5da5914f2f3f790d7c1f34e7",
            "code": "OBS_DESIGNER",
            "title": "Observation Designer"
        }
      ]
  */

  staffLogin(req) {

    return new Promise(async (resolve, reject) => {

      try {

        let result = await platformRolesHelper.list({
          status: "active",
          isDeleted: false
        }, {
            code: 1,
            title: 1
          });

        return resolve({
          message: "Platform roles fetched successfully.",
          result: result
        });

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
  * @api {post} /user-management/api/v1/punjabSSO/encryptionService Punjab Encryption Service
  * @apiVersion 1.0.0
  * @apiName Punjab Encryption Service
  * @apiGroup Punjab SSO
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management/api/v1/punjabSSO/encryptionService
  * @apiParamExample {json} Request-Body:
  * 
  *   {
  *       "string" : "123123123"
  *   }
  *
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  *  "result": [
        {
            "string": "5da5914f2f3f790d7c1f34e7"
        }
      ]
  */

  encryptionService(req) {

      return new Promise(async (resolve, reject) => {

        try {

          let result = await punjabSSOHelper.encrypt(req.body.string);

          return resolve({
            message: "String encryption completed successfully.",
            result: {string:result}
          });

        } catch (error) {

          return reject({
            status: error.status || 500,
            message: error.message || "Oops! something went wrong.",
            errorObject: error
          })

        }


      })
  }

};
