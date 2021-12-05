const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const users = require("../data/users");

router.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (typeof username !== 'string' || typeof password !== 'string') {
        res.status(400).render("pages/loginform", {message:'username and passwork must be string', error: true});
        return;
    }
    username = username.trim().toLowerCase();
    password = password.trim();
    if (username.length === 0 || password.length === 0) {
        res.status(400).render("pages/loginform", {message:'username and passwork must be non empty string and can\'t just be space', error: true});
        return;
    }
    let matchStr = /^[a-z0-9]{4,}$/i;
    if (!matchStr.test(username)) {
        res.status(400).render("pages/loginform", {message:'username can only be alphanumeric characters and should be at least 4 characters long.', error: true});
        return;
    }
    if (password.length < 6) {
        res.status(400).render("pages/loginform", {message:'password must be longer than 6', error: true});
        return;
    }
    if(password.indexOf(" ") >= 0) {
        res.status(400).render("pages/loginform", {message:'password can\'t contain space', error: true});
        return;
    }
    let tmp;
    try {
        tmp = await users.checkUser(username, password);
    } catch (e) {
        res.status(400).render("pages/loginform", {message:e, error: true});
        return;
    }
    if (tmp.authenticated === true) {
        req.session.user = username;//user name or id?
        res.redirect("/");//goto main page if user has logined in
    } else {
        res.status(400).render("pages/loginform", {message:"please try again", error: true});
        return;
    }
})


router.get('/favor/:id', async (req, res) => {//get all favor 
    let id = req.params.id;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.getRecruiter(id);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});
