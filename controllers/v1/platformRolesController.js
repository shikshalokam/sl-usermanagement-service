const csv = require("csvtojson");
const platformRolesHelper = require(ROOT_PATH + "/module/platformRoles/helper")
const FileStream = require(ROOT_PATH + "/generics/fileStream");

module.exports = class PlatformRoles extends Abstract {

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
    super(platformRolesSchema);
  }

  static get name() {
    return "platformRolesExt";
  }

  /**
  * @api {get} /user-management/api/v1/platformRoles/list User Roles list
  * @apiVersion 1.0.0
  * @apiName Platform User Roles list
  * @apiGroup Platform User Role Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management/api/v1/platformRoles/list
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

  list(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await platformRolesHelper.list({
          status: "active"
        }, {
          code: 1,
          title: 1
        });

        return resolve({
          message: constants.apiResponses.PLATFORM_ROLES,
          result: result
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
  * @api {post} /user-management/api/v1/platformRoles/bulkCreate Bulk Create User Roles
  * @apiVersion 1.0.0
  * @apiName Platform Bulk Create User Roles
  * @apiGroup Platform User Role Extension
  * @apiParam {File} platformRoles Mandatory platform roles file of type CSV.
  * @apiSampleRequest /user-management/api/v1/platformRoles/bulkCreate
  * @apiUse successBody
  * @apiUse errorBody
  */

  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let platformRolesCSVData = await csv().fromString(req.files.platformRoles.data.toString());

        if (!platformRolesCSVData || platformRolesCSVData.length < 1) throw "File or data is missing."

        let newUserRoleData = await platformRolesHelper.bulkCreate(platformRolesCSVData, req.userDetails);

        if (newUserRoleData.length > 0) {

          const fileName = `UserRole-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newUserRoleData.map(async userRole => {
            input.push(userRole)
          }))

          input.push(null)

        } else {
          throw "Something went wrong!"
        }

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
  * @api {post} /user-management/api/v1/platformRoles/bulkUpdate Bulk Update User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Update User Roles
  * @apiGroup Platform User Role Extension
  * @apiParam {File} platformRoles Mandatory platform roles file of type CSV.
  * @apiSampleRequest /user-management/api/v1/platformRoles/bulkUpdate
  * @apiUse successBody
  * @apiUse errorBody
  */
  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let platformRolesCSVData = await csv().fromString(req.files.platformRoles.data.toString());

        if (!platformRolesCSVData || platformRolesCSVData.length < 1) throw "File or data is missing."

        let newUserRoleData = await platformRolesHelper.bulkUpdate(platformRolesCSVData, req.userDetails);

        if (newUserRoleData.length > 0) {

          const fileName = `UserRole-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newUserRoleData.map(async userRole => {
            input.push(userRole)
          }))

          input.push(null)

        } else {
          throw "Something went wrong!"
        }

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })
  }



  
};
