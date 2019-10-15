/**
 * Project          : Shikshalokam-Assessment-Design
 * Module           : Configuration
 * Source filename  : index.js
 * Description      : Environment related configuration variables
 */

let db_connect = function(configData) {
  global.database = require("./dbConfig")(
    configData.db.connection.mongodb
  );
  global.ObjectId = database.ObjectId;
  global.Abstract = require("../generics/abstract");
};

const configuration = {
  root: require("path").normalize(__dirname + "/.."),
  app: {
    name: "sl-assessment-design"
  },
  host: process.env.HOST || "http://localhost",
  port: process.env.PORT || 4601,
  log: process.env.LOG || "debug",
  db: {
    connection: {
      mongodb: {
        host: process.env.MONGODB_URL || "mongodb://localhost:27017",
        user: "",
        pass: "",
        database: process.env.DB || "sl-assessment",
        options: {
          useNewUrlParser: true
        }
      }
    },
    plugins: {
      timestamps: true,
      elasticSearch: false,
      softDelete: true,
      autoPopulate: false,
      timestamps_fields: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  },
  version: "1.0.0",
  URLPrefix: "/api/v1",
  webUrl: "https://dev.shikshalokam.org"
};

db_connect(configuration);

module.exports = configuration;
