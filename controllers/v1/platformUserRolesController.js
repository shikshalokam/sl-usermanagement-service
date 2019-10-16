const csv = require("csvtojson");
// const platformUserRolesHelper = require(ROOT_PATH + "/module/platformUserRoles/helper")
const FileStream = require(ROOT_PATH + "/generics/fileStream");

module.exports = class PlatformUserRoles extends Abstract {
  constructor() {
    super(platformUserRolesSchema);
  }

  static get name() {
    return "platformUserRoles";
  }

  /**
  * @api {get} /user-management/api/v1/platformUserRoles/getProfile/{{userId}} Get user profile
  * @apiVersion 1.0.0
  * @apiName Get user profile
  * @apiGroup User Extension
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /user-management/api/v1/platformUserRoles/getProfile/e97b5582-471c-4649-8401-3cc4249359bb
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
  *  "_id": "5d5e4758f89df53a1d26b454",
     "externalId": "a1",
     "roles": [
        {
         "_id": "5d5e47051f5a363a0a187029",
         "code": "HM",
         "title": "Headmaster",
         "immediateSubEntityType": "school",
         "entities": [
          {
            "_id": "5bfe53ea1d0c350d61b78d0f",
            "externalId": "1208138",
            "name": "Shri Shiv Middle School, Shiv Kutti, Teliwara, Delhi",
            "childrenCount": 0,
             "entityType": "school",
             "entityTypeId": "5ce23d633c330302e720e65f",
             "subEntityGroups": [
              "parent"
              ]
            }
          ]
       }
     ]
  * }
  */

  getProfile(req) {
    return new Promise(async (resolve, reject) => {

      try {
          
        let queryObject = {
          userId: (req.params._id && req.params._id != "") ? req.params._id : req.userDetails.userId,
          status: "active",
          isDeleted: false
          }

        let platformUserRolesDocument = await database.models.platformUserRolesExt.findOne(
          queryObject
        ).lean();

        if(!platformUserRolesDocument){
          return resolve({
            message:"No platform user for given params",
            status:400
          })
        }

        return resolve({
          message: "Platform user profile fetched successfully.",
          result: platformUserRolesDocument
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
  * @api {post} /user-management/api/v1/platformUserRoles/bulkUpload Bulk Upload User Roles
  * @apiVersion 1.0.0
  * @apiName Bulk Upload User Roles
  * @apiGroup User Extension
  * @apiParam {File} userRoles Mandatory user roles file of type CSV.
  * @apiSampleRequest /user-management/api/v1/platformUserRoles/bulkUpload
  * @apiUse successBody
  * @apiUse errorBody
  */

  // bulkUpload(req) {
  //   return new Promise(async (resolve, reject) => {

  //     try {

  //       let userRolesCSVData = await csv().fromString(req.files.userRoles.data.toString());

  //       if (!userRolesCSVData || userRolesCSVData.length < 1) throw "File or data is missing."

  //       let newUserRoleData = await platformUserRolesHelper.bulkCreateOrUpdate(userRolesCSVData, req.userDetails);

  //       if (newUserRoleData.length > 0) {

  //         const fileName = `UserRole-Upload`;
  //         let fileStream = new FileStream(fileName);
  //         let input = fileStream.initStream();

  //         (async function () {
  //           await fileStream.getProcessorPromise();
  //           return resolve({
  //             isResponseAStream: true,
  //             fileNameWithPath: fileStream.fileNameWithPath()
  //           });
  //         }());

  //         await Promise.all(newUserRoleData.map(async userRole => {
  //           input.push(userRole)
  //         }))

  //         input.push(null)

  //       } else {
  //         throw "Something went wrong!"
  //       }

  //     } catch (error) {

  //       return reject({
  //         status: error.status || 500,
  //         message: error.message || "Oops! something went wrong.",
  //         errorObject: error
  //       })

  //     }


  //   })
  // }

};
