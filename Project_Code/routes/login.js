const { ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", async(req, res) => {
  return res.render('pages/applicantlogin', {title:"Applicant Login"});
});

router.post("/", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //let status = req.body.status; //**************use status to store a form data that shows the user is applicant or recruiter */
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).render("pages/loginform", {
        message: "email and passwork must be string",
        error: true,
      });
      return;
    }
    email = email.trim().toLowerCase();
    password = password.trim();
    if (email.length === 0 || password.length === 0) {
      res.status(400).render("pages/loginform", {
        message:
          "Not a valid email format",
        error: true,
      });
      return;
    }
    const emailCheck = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im;
    if (!emailCheck.test(email)) {
      res.status(400).render("pages/loginform", {
        message:
          "email can only be alphanumeric characters and should be at least 4 characters long.",
        error: true,
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).render("pages/loginform", {
        message: "password must be longer than 6",
        error: true,
      });
      return;
    }
    if (password.indexOf(" ") >= 0) {
      res.status(400).render("pages/loginform", {
        message: "password can't contain space",
        error: true,
      });
      return;
    }
    let tmp;
    try {//*********change here to add recruter login in */
      tmp = await users.checkUser(email, password);
    } catch (e) {
      res.status(400).render("pages/loginform", { message: e, error: true });
      return;
    }
    if (tmp.authenticated === true) {
      req.session.userId = tmp.id; //user id
      res.redirect("/"); //goto main page if user has logined in
    } else {
      res
        .status(400)
        .render("pages/loginform", { message: "please try again", error: true });
      return;
    }
  });


  module.exports = router;