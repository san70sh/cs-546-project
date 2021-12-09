const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const users = require("../data/users");
const upload = require("../data/upload").upload;
const download = require("../data/upload").download;

router.get("/profile", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  try {
    // const resumes = await users.getAllResume(req.body.userId);
    const resumes = await users.getAllResume(req.session.user.id);
    res.render("pages/userProfile", { resumes });
  } catch (e) {
    return res.render("pages/userProfile", { error: e.message });
  }
});

router.post("/profile/upload", upload.single("file"), async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  // check file existence
  if (req.file === undefined) {
    return res.render("pages/userProfile", { error: "you must select a file" });
  }
  // check file type
  if (req.file.mimetype !== "application/pdf") {
    return res.render("pages/userProfile", { error: "file type error" });
  }
  console.log(res.req.file);
  try {
    const addRes = await users.addResume(req.session.user.id, res.req.file.id);
    console.log(addRes);
  } catch (e) {
    res.render("pages/userProfile", { error: e.message });
    console.log(e);
  }
  res.redirect("/users/profile");
});

router.get("/profile/resume/:id", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  try {
    const downloadStream = await download(req.params.id);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res
        .status(404)
        .render("/users/profile", { error: "Cannot download the resume!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (e) {
    res.send({ error: e });
  }
  // res.redirect("/users/profile");
});

router.delete("/profile/resume/:id", async (req, res) => {});

router.get("/login", async(req, res) => {
//   if(req.session.user){
//   if (req.session.user.type == 'recruiter'){
//     res.redirect("/recruiter/login");
//   }else if(req.session.user.type == 'user'){
//     console.log('user : already logged in');
//     return res.redirect('/');     
//   }
// }
  return res.render('pages/applicantlogin', {title:"Applicant Login"});
});

router.get('/signup', async (req, res) => {
  // if(req.session.user){
  //     if (req.session.user.type == 'user'){
  //         return res.redirect('/');       
  //     }

  //     if(req.session.user.type == 'recruiter'){
  //         return res.redirect('/recruiter/signup');
  //     }
  // }
  return res.render('pages/applicantSignup', {title:"Applicant Sign-up"});
})

router.get('/:id', async (req, res) => {
  if(!req.session.user){
    return res.redirect('/users/login');
}

 if(req.session.user){
    if(req.session.user.type !=='user'){
        return res.redirect('/users/login');
        }
    }
  let id = req.params.id, user, newUser;
  if(ObjectId.isValid(id)) {
      try{
          user = await users.get(id);
          if(Object.keys(user.profile).length == 0) {
              newUser = true;
          } else {
              newUser = false
          }
      } catch(e) {
          console.log(e);
      }
      return res.render('pages/applicantProfile',{user: user, jobs: user.jobs, userId: id, newUser: newUser});
  }
});

router.get('/profile/:id', async (req, res) => {
  let id = req.params.id;
  try {
       // common session code all of your private routes
       if(!req.session.user){
          return res.redirect('/users/login');
      }

      if(req.session.user){
          if(req.session.user.type !=='user'){
              return res.redirect('/users/login');
          }
      }
      if(ObjectId.isValid(id)) {
          let user = await users.get(id);
          console.log(user);
          if(Object.keys(user.profile).length != 0) {
              return res.render('pages/applicanteditprofile', {title: "Update", method: "POST", recid: "update/"+id});
          } else {
              return res.render('pages/applicanteditprofile', {title: "Create", method: "POST", recid: id});
          }
      }
  } catch (e) {
      return res.status(e.status).render('pages/applicanteditprofile', {message: e.message, err: true});
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  //let status = req.body.status; //**************use status to store a form data that shows the user is applicant or recruiter */
  if (typeof email !== "string") {
    res.status(400).render("pages/applicantlogin", {
      message: "email and passwork must be string",
      emailerr: true,
    });
    return;
  }
  if (typeof password !== "string") {
    res.status(400).render("pages/applicantlogin", {
      message: "email and passwork must be string",
      pwderr: true,
    });
    return;
  }
  email = email.trim().toLowerCase();
  password = password.trim();
  if (email.length === 0 || password.length === 0) {
    res.status(400).render("pages/applicantlogin", {
      message: "Not a valid email format",
      emailerr: true,
    });
    return;
  }
  const emailCheck = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im;
  if (!emailCheck.test(email)) {
    res.status(400).render("pages/applicantlogin", {
      message:
        "email can only be alphanumeric characters and should be at least 4 characters long.",
      emailerr: true,
    });
    return;
  }
  if (password.length < 6) {
    res.status(400).render("pages/applicantlogin", {
      message: "password must be longer than 6",
      pwderr: true,
    });
    return;
  }
  if (password.indexOf(" ") >= 0) {
    res.status(400).render("pages/applicantlogin", {
      message: "password can't contain space",
      pwderr: true,
    });
    return;
  }
  let tmp;
  try {
    //*********change here to add recruter login in */

    tmp = await users.checkUser(email, password);
  } catch (e) {
    res.status(400).render("pages/applicantlogin", { message: e.message, mainerr: true });
    return;
  }
  if (tmp.authenticated === true) {
    req.session.user = { email: email, type: "user", id: tmp.id };
    res.redirect(`/users/${tmp.id}`); //goto main page after user has logined in
  } else {
    res.status(400).render("pages/applicantlogin", {
      message: "please try again",
      mainerr: true,
    });
    return;
  }
});

router.post('/signup', async (req, res) => {
      let {email, password, firstName, lastName, phone} = req.body;
      let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
      if(email == "" || email == undefined) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Please enter your email.", emailerr: true});
      if(email.length < 6) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "The email is too short.", emailerr: true});
      if(!re.test(email)) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: `${email} is not a valid email.`, emailerr: true});
      email = email.toLowerCase();

      //password validation
      let re2 = /\s/i
      if(!password) return res.status(400).render('pages/applicantSignup',{title: "Sign Up/Register", message: `Please enter your password`, pwderr: true});
      if(re2.test(password)) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Spaces are not allowed in passwords.", pwderr: true});
      if(password.length < 6) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Password is too short.", pwderr: true});

      //name validation
      let re3 = /[A-Z]/i
      firstName = firstName.trim();
      lastName = lastName.trim();
      if(firstName == "" || firstName == undefined) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Please enter your first name.", fnerr: true});
      if(!re3.test(firstName)) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Your name should not contain special characters.", fnerr: true});
      if(lastName == "" || lastName == undefined) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Please enter your last name.", lnerr: true});
      if(!re3.test(lastName)) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Your name should not contain special characters.", lnerr: true});

      //phone validation
      let re4 = /[0-9]{10}/
      phone = phone.trim();
      if(phone == "" || phone == undefined) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Please enter your phone number.", pherr: true});
      if(phone.length != 10) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Invalid phone number.", pherr: true});
      if(!re4.test(phone)) return res.status(400).render('pages/applicantSignup', {title: "Sign Up/Register", message: "Invalid phone number.", pherr: true});
      try {
          let userId = await users.create(email, phone, firstName, lastName, password);
              req.session.user = {email: email,type:"user",id: userId};
              console.log(req.session.user)
              return res.redirect(`/users/${userId}`);
      } catch (e) {
          return res.status(e.status).render('pages/applicantSignup', {title: "Sign Up/Register", message: e.message, mainerr: true});
      }
});
router.get("/favor", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  //get all favor
  let userId = req.session.user.id;
  if (!ObjectId.isValid(userId)) {
    res.status(e.status).render("pages/error", {
      title: "Favor",
      message: "inValid userId",
      error: true,
    });
  }
  try {
    let output = await users.getFavourites(userId);
    return res.json(output);
  } catch (e) {
    return res.status(e.status).render("pages/error", {
      title: "Favor",
      message: e.message,
      error: true,
    });
  }
});

router.post("/favor", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }
  let jobId = req.body.jobId;
  let userId = req.session.user.id;
  if (!ObjectId.isValid(jobId) || !ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "favor",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.Favorites(jobId, userId);
    return res.json(output);
  } catch (e) {
    return res
      .status(e.status)
      .render("pages/error", { title: "favor", message: e.message, err: true });
  }
});

router.delete("/favor", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  let jobId = req.body.jobId;
  let userId = req.session.user.id;
  if (!ObjectId.isValid(jobId) || !ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "favor",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.delFavourites(jobId, userId);
    return res.json(output);
  } catch (e) {
    return res
      .status(e.status)
      .render("pages/error", { title: "Favor", message: e.message, err: true });
  }
});

router.post("/apply", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  let jobId = req.body.jobId;
  let userId = req.session.user.id;
  if (!ObjectId.isValid(jobId) || !ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "apply",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.apply(jobId, userId);
    return res.json(output);
  } catch (e) {
    return res
      .status(e.status)
      .render("pages/error", { title: "Apply", message: e.message, err: true });
  }
});

router.delete("/apply", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  let jobId = req.body.jobId;
  let userId = req.session.user.id;
  if (!ObjectId.isValid(jobId) || !ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "apply",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.cancel(jobId, userId);
    return res.json(output);
  } catch (e) {
    return res
      .status(e.status)
      .render("pages/error", { title: "Favor", message: e.message, err: true });
  }
});

router.get("/apply/:id", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  if (req.session.user) {
    if (req.session.user.type !== "user") {
      return res.redirect("/users/login");
    }
  }

  let userId = req.session.user.id;
  let jobId = req.params.jobId;
  if (!ObjectId.isValid(jobId) || !ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "apply",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.track(jobId, userId);
    return res.json(output);
  } catch (e) {
    return res.status(e.status).render("pages/error", {
      title: "Favor",
      message: e.message,
      error: true,
    });
  }
});

router.get("/apply", async (req, res) => {
  // common session code all of your private routes
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

    // common session code all of your private routes
    if(!req.session.user){
      return res.redirect('/users/login');
  }

  if(req.session.user){
      if(req.session.user.type !=='user'){
          return res.redirect('/users/login');
      }
  }
  let userId = req.session.user.id;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).render("pages/error", {
      title: "apply",
      message: "invalid id",
      err: true,
    });
  }
  try {
    let output = await users.trackAll(userId);
    return res.json(output);
  } catch (e) {
    return res.status(e.status).render("pages/error", {
      title: "Favor",
      message: e.message,
      error: true,
    });
  }
});

module.exports = router;
