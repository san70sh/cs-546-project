const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const users = require("../data/users");
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/mongoConnection").dbConfig;

router.post("/upload", async (req, res) => {
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
  var upload = util.promisify(uploadFiles);
  try {
    await upload(req, res);
    console.log(req.body);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.status(200).send({
      message: "Files have been uploaded.",
    });

    // console.log(req.file);

    // return res.send({
    //   message: "File has been uploaded.",
    // });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });

    // return res.send({
    //   message: "Error when trying upload image: ${error}",
    // });
  }
});

// router.post("/login", async (req, res) => {
//   let email = req.body.email;
//   let password = req.body.password;
//   if (typeof email !== "string" || typeof password !== "string") {
//     res.status(400).render("pages/loginform", {
//       message: "email and passwork must be string",
//       error: true,
//     });
//     return;
//   }
//   email = email.trim().toLowerCase();
//   password = password.trim();
//   if (email.length === 0 || password.length === 0) {
//     res.status(400).render("pages/loginform", {
//       message:
//         "Not a valid email format",
//       error: true,
//     });
//     return;
//   }
//   const emailCheck = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im;
//   if (!emailCheck.test(email)) {
//     res.status(400).render("pages/loginform", {
//       message:
//         "email can only be alphanumeric characters and should be at least 4 characters long.",
//       error: true,
//     });
//     return;
//   }
//   if (password.length < 6) {
//     res.status(400).render("pages/loginform", {
//       message: "password must be longer than 6",
//       error: true,
//     });
//     return;
//   }
//   if (password.indexOf(" ") >= 0) {
//     res.status(400).render("pages/loginform", {
//       message: "password can't contain space",
//       error: true,
//     });
//     return;
//   }
//   let tmp;
//   try {
//     tmp = await users.checkUser(email, password);
//   } catch (e) {
//     res.status(400).render("pages/loginform", { message: e, error: true });
//     return;
//   }
//   if (tmp.authenticated === true) {
//     req.session.id = tmp.id; //user id
//     res.redirect("/"); //goto main page if user has logined in
//   } else {
//     res
//       .status(400)
//       .render("pages/loginform", { message: "please try again", error: true });
//     return;
//   }
// });

// if ...  should have else throw otherwise it would have no respondes
router.get('/favor', async (req, res) => {//get all favor 
    let userId = req.body.userId;
    try {
        if(ObjectId.isValid(userId)) {
            let output = await users.getFavourites(userId);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('pages/loginForm', {title: "Favor", message: e.message, error: true});
    }
});

router.post('/favor', async (req, res) => {
    let jobId = req.body.jobId;
    let userId = req.body.userId;
    try {
        if(ObjectId.isValid(jobId) && ObjectId.isValid(userId)) {
            let output = await users.Favorites(jobId, userId);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('pages/error', {title: "Apply", message: e.message, err: true});
    }
});

router.delete('/favor', async (req, res) => {
    let jobId = req.body.jobId;
    let userId = req.body.userId;
    try {
        if(ObjectId.isValid(jobId) && ObjectId.isValid(userId)) {
            let output = await users.delFavourites(jobId, userId);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('pages/error', {title: "Favor", message: e.message, err: true});
    }
});

router.post('/apply', async (req, res) => {
    let jobId = req.body.jobId;
    let userId = req.body.userId;
    try {
        if(ObjectId.isValid(jobId) && ObjectId.isValid(userId)) {
            let output = await users.apply(jobId, userId);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('pages/error', {title: "Apply", message: e.message, err: true});
    }
});


router.delete("/apply", async (req, res) => {
  let jobId = req.body.jobId;
  let userId = req.body.userId;
  try {
    if (ObjectId.isValid(jobId) && ObjectId.isValid(userId)) {
      let output = await users.cancel(jobId, userId);
      return res.json(output);
    }
  } catch (e) {
    return res
      .status(e.status)
      .render("pages/error", { title: "Favor", message: e.message, err: true });
  }
});

router.get("/apply/:id", async (req, res) => {
  let userId = req.body.userId;
  let jobId = req.params.jobId;
  try {
    if (ObjectId.isValid(userId) && ObjectId.isValid(jobId)) {
      let output = await users.track(jobId, userId);
      return res.json(output);
    }
  } catch (e) {
    return res.status(e.status).render("pages/error", {
      title: "Favor",
      message: e.message,
      error: true,
    });
  }
});

router.get("/apply", async (req, res) => {
  let userId = req.body.userId;
  try {
    if (ObjectId.isValid(userId)) {
      let output = await users.trackAll(userId);
      return res.json(output);
    }
  } catch (e) {
    return res.status(e.status).render("pages/error", {
      title: "Favor",
      message: e.message,
      error: true,
    });
  }
});

module.exports = router;
