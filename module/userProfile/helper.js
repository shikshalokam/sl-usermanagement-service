/**
 * name : userProfile/helper.js
 * author : Aman
 * Date : 10-feb-2019
 * Description : All user profile helper related information.
 */

module.exports = class UserProfileHelper {

    /**
   * Create user profile.
   * @method
   * @name create
   * @param  {requestedData}  - requested body.
   * @returns {json} Response consists of created user profile data.
   */

    static create( requestedData ) {
        return new Promise(async (resolve, reject) => {
            try {

                let userProfileData = await database.models.userProfile.findOne({
                    userId : requestedData.userId
                },{ 
                    _id : 1 
                }).lean();

                if( userProfileData ) {
                    throw {
                        message : 
                        messageConstants.apiResponses.USER_EXISTS
                    };
                }

                let userExtensionDocument = 
                await database.models.userExtension.findOne(
                    {
                        userId : requestedData.userId
                    },{ 
                        externalId : 1 
                    }
                ).lean();

                if( !userExtensionDocument ) {
                    throw {
                        message : 
                        messageConstants.apiResponses.USER_EXTENSION_NOT_FOUND
                    };
                }

                requestedData["externalId"] = userExtensionDocument.externalId;

                let userProfileCreation = await database.models.userProfile.create(
                    requestedData
                );

                return resolve({
                    result : userProfileCreation
                });

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Update user profile.
   * @method
   * @name update
   * @param  {requestedData}  - requested body.
   * @param  {userId}  - logged in user id.
   * @returns {json} Response consists of updated user profile data.
   */

    static update( requestedData, userId ) {
        return new Promise(async (resolve, reject) => {
            try {

                let userProfileData = await database.models.userProfile.findOne({
                    userId : userId
                },{ 
                    _id : 1 
                }).lean();

                // If user profile for logged in user doesnot exists .
                // create new user profile document.

                let userProfileCreatedOrUpdated;

                if( !userProfileData ) {

                    let userExtensionDocument = 
                    await database.models.userExtension.findOne({
                        userId : userId
                    },{
                        externalId : 1
                    });

                    if( !userExtensionDocument ) {
                        throw {
                            message : 
                            messageConstants.apiResponses.USER_EXTENSION_NOT_FOUND
                        }
                    }

                    requestedData["userId"] = userId;
                    requestedData["externalId"] = userExtensionDocument.externalId;
                    requestedData["createdBy"] = userId;
                    
                    userProfileCreatedOrUpdated = 
                    await database.models.userProfile.create(
                        requestedData
                    );

                } else {
                    let updateObject = {
                        "$set" : {}
                      };
              
                      Object.keys(requestedData).forEach(data=>{
                        updateObject["$set"][data] = 
                        requestedData[data];
                      });
              
                      updateObject["$set"]["updatedBy"] = userId;
                      updateObject["$set"]["updatedAt"] = new Date();

                      let queryObject = {
                          _id : userProfileData._id,
                          status :  messageConstants.common.ACTIVE
                      }

                      userProfileCreatedOrUpdated = 
                      await database.models.userProfile.findOneAndUpdate(
                          queryObject, 
                          updateObject,
                          { new : true }
                      );
                }
                
                if( userProfileCreatedOrUpdated._id ) {
                    return resolve({
                        message : messageConstants.apiResponses.USER_UPDATED
                    });
                } else {
                    throw {
                        message : messageConstants.apiResponses.USER_NOT_UPDATED
                    };
                }
            }
            catch (error) {
                return reject(error);
            }
        })
    }

      /**
   * Verify user profile.
   * @method
   * @name verify
   * @param  {userId} - logged in user id.
   * @returns {json} - Response consists of verified user profile data.
   */

    static verify( userId ) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let userProfileData = await database.models.userProfile.findOne({
                    userId : userId
                },{ 
                    _id : 1 
                }).lean();
                
                if( !userProfileData._id ) {
                    throw {
                        message : 
                        messageConstants.apiResponses.USER_PROFILE_NOT_FOUND
                    };
                
                } else {
                    
                    let updateObject = {
                        "$set" : {
                            verified : true
                        }
                    };

                    let queryObject = {
                        _id : userProfileData._id,
                        status : messageConstants.common.ACTIVE
                    }

                    await database.models.userProfile.findOneAndUpdate(
                        queryObject, 
                        updateObject,
                        { new : true }
                    );
                    
                    resolve({
                        message : 
                        messageConstants.apiResponses.USER_PROFILE_VERIFIED
                    })
                }
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Verify user profile.
   * @method
   * @name inAppUserProfileNotifications
   * @returns {json} - Response consists of verified user profile data.
   */

    static list() {
        return new Promise(async (resolve, reject) => {
            try {

                let userProfileDocuments = 
                await database.models.userProfile.find({
                    status : messageConstants.common.ACTIVE,
                    isDeleted : messageConstants.common.FALSE
                }).lean();

                if( userProfileDocuments && userProfileDocuments.length < 1 ) {
                    throw {
                        message : 
                        messageConstants.apiResponses.USER_PROFILE_NOT_FOUND
                    };
                }

                return resolve({
                    result : userProfileDocuments
                });

            } catch(error) {
                return reject(error);
            }
        });
    }

    /**
   * Details user profile.
   * @method
   * @name details
   * @returns {json} - Response consists of verified user profile data.
   */

  static details(userId) {
    return new Promise(async (resolve, reject) => {
        try {

            let userProfileDocument = 
            await database.models.userProfile.findOne({
                userId : userId,
                status : messageConstants.common.ACTIVE,
                isDeleted : messageConstants.common.FALSE
            });

            if( !userProfileDocument ) {
                throw {
                    message : 
                    messageConstants.apiResponses.USER_PROFILE_NOT_FOUND
                };
            }

            return resolve({
                result : userProfileDocument
            });

        } catch(error) {
            return reject(error);
        }
    });
  }

};