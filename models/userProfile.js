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
        required : true
      },
      lastName: {
        type : String,
         default : ""
      },
      createdBy: {
        type : String,
        default : ""
      },
      updatedBy: {
        type : String,
        default : ""
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
         default : ""
      },
      externalId: {
        type : String,
        default : ""
      },
      phoneNumber: {
        type : String,
        default : ""
      },
      state: {
        type : String,
        required : true
      },
      district: {
        type : String,
        default : null
      },
      block: {
        type: String,
        default: null
      },
      zone: {
        type : String,
        default : null
      },
      cluster: {
        type : String,
        default : null
      },
      taluk: {
        type : String,
        default : null
      },
      hub: {
        type : String,
        default : null
      },
      school: {
        type : String,
        default : null
      },
      verified: {
        type : Boolean,
        default : false
      }
    }
}