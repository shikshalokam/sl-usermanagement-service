module.exports = {
  name: "platformUserRolesExt",
  schema: {
    roles: Array,
    createdBy : String,
    updatedBy : String,
    userId : "ObjectId",
    username : String,
    status : String,
    isDeleted: Boolean
  }
};
