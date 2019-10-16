module.exports = {
  async up(db) {
    global.migrationMsg = global.migrationMsg = "Add platform role extension"
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  
    await db.collection('platformRolesExt').createIndex( { code: 1}, { unique: true , background : 1} )
   
    let obsDesigner = {
      "code" : "OBS_DESIGNER",
      "title" : "Observation Designer",
      "createdAt" : new Date,
      "updatedAt" : new Date,
      "createdBy" : "SYSTEM",
      "updatedBy" : "SYSTEM",
      "status" : "active",
      "isDeleted" : false
  }
  
    let obsReviewer = {
      "code" : "OBS_REVIEWER",
      "title" : "Observation Reviewer",
      "createdAt" : new Date,
      "updatedAt" : new Date,
      "createdBy" : "SYSTEM",
      "updatedBy" : "SYSTEM",
      "status" : "active",
      "isDeleted" : false
  }


    return await db.collection('platformRolesExt').insertMany( [
      obsDesigner,
      obsReviewer
    ]);
  
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
