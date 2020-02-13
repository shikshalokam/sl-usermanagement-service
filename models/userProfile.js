/**
 * name : user-profile.js
 * author : Aman Jung Karki
 * Date : 15-Nov-2019
 * Description : Schema for user Profile collection.
 */

module.exports = {
    name: "userProfile",
    schema: {
      firstName: {
        type : String,
        default : null
      },
      lastName: {
        type : String,
         default : null
      },
      createdBy: {
        type : String,
        default : null
      },
      updatedBy: {
        type : String,
        default : null
      },
      userId : {
        type : String,
        required : true
      },
      externalId: {
        type: String,
        required: true
      },
      status: {
        type : String,
        default : "active"
      },
      isDeleted: {
        type : Boolean,
        default : false
      },
      emailId: {
        type: String,
         default : null
      },
      externalId: {
        type : String,
        default : null
      },
      phoneNumber: {
        type : String,
        default : null
      },
      state: {
        type : "ObjectId",
        default : null
      },
      district: {
        type : "ObjectId",
        default : null
      },
      block: {
        type: "ObjectId",
        default: null
      },
      zone: {
        type : "ObjectId",
        default : null
      },
      cluster: {
        type : "ObjectId",
        default : null
      },
      taluk: {
        type : "ObjectId",
        default : null
      },
      hub: {
        type : "ObjectId",
        default : null
      },
      school: {
        type : "ObjectId",
        default : null
      },
      verified: {
        type : Boolean,
        default : false
      },
      sentPushNotifications : {
        type : Boolean,
        default : false
      }
    }
}