const csv = require("csvtojson");
const platformUserRolesHelper = require(MODULES_BASE_PATH + "/platformUserRoles/helper")
const FileStream = require(GENERICS_FILES_PATH + "/file-stream");

module.exports = class PlatformUserRoles extends Abstract {
  constructor() {
    super("platformUserRolesExt");
  }

  static get name() {
    return "platformUserRoles";
  }

 
  /**
  * @api {post} /user-management/api/v1/platformUserRoles/bulkCreate Bulk Create Platform User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Create Platform User Roles
  * @apiGroup Platform User Extension
  * @apiParam {File} platformUserRoles Mandatory user roles file of type CSV.
  * @apiSampleRequest /user-management/api/v1/platformUserRoles/bulkCreate
  * @apiUse successBody
  * @apiUse errorBody
  */

  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userRolesCSVData = await csv().fromString(req.files.platformUserRoles.data.toString());

        if (!userRolesCSVData || userRolesCSVData.length < 1) throw "File or data is missing."

        let newUserRoleData = await platformUserRolesHelper.bulkCreateOrUpdate(userRolesCSVData, req.userDetails);

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
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })
  }

  /**
  * @api {post} /user-management/api/v1/platformUserRoles/bulkUpdate Bulk Update Platform User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Update Platform User Roles
  * @apiGroup Platform User Extension
  * @apiParam {File} platformUserRoles Mandatory user roles file of type CSV.
  * @apiSampleRequest /user-management/api/v1/platformUserRoles/bulkUpdate
  * @apiUse successBody
  * @apiUse errorBody
  */

  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userRolesCSVData = await csv().fromString(req.files.platformUserRoles.data.toString());

        if (!userRolesCSVData || userRolesCSVData.length < 1) throw "File or data is missing."

        let newUserRoleData = await platformUserRolesHelper.bulkCreateOrUpdate(userRolesCSVData, req.userDetails);

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
          status: error.status || HTTP_STATUS_CODE.internal_server_error.status,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })
  }




};
