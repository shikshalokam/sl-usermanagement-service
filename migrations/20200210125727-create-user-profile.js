module.exports = {
  
  async up(db) {
    global.migrationMsg = "Create user profiles";

    let userExtensionDocuments = 
    await db.collection('userExtension').find({}).project(
      { userId : 1, externalId : 1}).toArray();
      
    if( userExtensionDocuments.length > 0 ) {

      let userProfileArray = [];
      let userProfile = {
        "firstName" : null,
        "lastName" : null,
        "emailId" : null,
        "phoneNumber" : null,
        "state" : null,
        "district" : null,
        "block" : null,
        "zone" : null,
        "cluster" : null,
        "taluk" : null,
        "hub" : null,
        "school" : null,
        "status" : "active",
        "isDeleted" : false,
        "verified" : false,
        "updatedBy" : false,
        "createdAt" : new Date(),
        "updatedAt" : null,
        "updatedBy" : null
      }

      for( 
        let pointerToUserExtension = 0; 
        pointerToUserExtension < userExtensionDocuments.length;
        pointerToUserExtension++) {
          
          let userProfileDoc = {...userProfile}
          userProfileDoc["userId"] =  
          userExtensionDocuments[pointerToUserExtension].userId;

          userProfileDoc["externalId"] = 
          userExtensionDocuments[pointerToUserExtension].externalId;

          userProfileDoc["createdBy"] = 
          userExtensionDocuments[pointerToUserExtension].userId;

          userProfileArray.push(userProfileDoc);
      }

      await db.collection('userProfile').insertMany(userProfileArray);

      await db.collection('userProfile').createIndex({ externalId: 1 });

      await db.collection('userProfile').createIndex({ userId: 1 });

      await db.collection('userProfile').createIndex({ status: 1 });
      return;
    }
  },

  async down(db) {
  }
};
