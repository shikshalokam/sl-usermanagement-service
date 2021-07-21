/**
 * name : mongodb.js.
 * author : Aman Karki.
 * created-date : 21-July-2021.
 * Description : Mongodb health check.
*/

// Dependencies
const mongoose = require("mongoose");

function health_check() {
    return new Promise( async (resolve,reject) => {

        const db = mongoose.createConnection(process.env.MONGODB_URL + ":" + process.env.MONGODB_PORT + "/" + process.env.MONGODB_DATABASE_NAME);
          
        db.on("error", function () {
            return resolve(false)
        });
        db.once("open", function() {
            return resolve(true);    
        });
    })
}

module.exports = {
    health_check : health_check
}