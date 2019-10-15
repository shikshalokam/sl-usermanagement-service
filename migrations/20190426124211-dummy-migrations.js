module.exports = {
  async up(db) {
    global.migrationMsg = "Dummy migrations"
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
