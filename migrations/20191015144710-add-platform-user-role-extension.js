module.exports = {
  async up(db) {
    global.migrationMsg = "Add necessary index for platform user role extension collection."
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('platformUserRolesExt').createIndex( { username: 1}, { unique: true , background : 1} )

    await db.collection('platformUserRolesExt').createIndex( { userId: 1}, { unique: true , background : 1} )

    return await db.collection('platformUserRolesExt').createIndex( { status: 1 }, { background : 1} )

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
