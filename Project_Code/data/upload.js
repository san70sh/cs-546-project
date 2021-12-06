const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/mongoConnection").dbConfig;

var storage = new GridFsStorage({
  url: dbConfig.serverUrl + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["application/pdf"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-user-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: dbConfig.userBucket,
      filename: `${Date.now()}-user-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single("file");
// var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
