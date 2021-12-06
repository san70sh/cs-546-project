const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/mongoConnection").dbConfig;

var storage = new GridFsStorage({
  url: dbConfig.serverUrl + dbConfig.database,
  file: (req, file) => {
    if (file.mimetype !== "application/pdf") {
      // const filename = `${Date.now()}-user-${file.originalname}`;
      return null;
    }

    return {
      bucketName: dbConfig.userBucket,
      filename: `${Date.now()}-user-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage });
// var uploadFiles = multer({ storage: storage }).single("file");
// var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFiles;
