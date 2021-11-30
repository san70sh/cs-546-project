const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const recruiterDat = require("../data/recruiters");

router.post('/login', async (req, res) => {
    if (req.session.user) return res.redirect('/private')
    else {
        let {email, password} = req.body;
        let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
        if(email == "" || email == undefined) return res.status(400).render('partials/loginform', {title: "Login Page", message: "Please enter your email.", err: true});
        if(email.length < 6) return res.status(400).render('partials/loginform', {title: "Login Page", message: "The email is too short.", err: true});
        if(!re.test(email)) return res.status(400).render('partials/loginform', {title: "Login Page", message: `${email} is not a valid email.`, err: true});

        //password validation
        let re2 = /\s/i
        if(!password) throw `Please enter your password`;
        if(re2.test(password)) return res.status(400).render('partials/loginform', {title: "Login Page", message: "Spaces are not allowed in passwords.", err: true});
        if(password.length < 6) return res.status(400).render('partials/loginform', {title: "Login Page", message: "Password is too short.", err: true});

        try {
            let output = await recruiterDat.recruiterCheck(email, password);
            if(output.authenticated) {
                req.session.user = username;
                return res.redirect('/private');
            }
        } catch (e) {
            return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
        }
    }
});

router.post('/accept', async (req, res) => {
    try {
        if(!req.session.user) {
            return res.status(403).render('partials/loginform', {title: "Login Page", message: "Unauthorized Access", err: true})
        } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.acceptDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        }
    } catch (e) {
        return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
    }
});

router.post('/reject', async (req, res) => {
    try {
        if(!req.session.user) {
            return res.status(403).render('partials/loginform', {title: "Login Page", message: "Unauthorized Access", err: true})
        } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.rejectDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        }
    } catch (e) {
        return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
    }
});

router.post('/signup', async (req, res) => {
    if (req.session.user) return res.redirect('/private')
    else {
        //Email validation
        let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
        if(email == "" || email == undefined) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your email.", err: true});
        if(email.length < 6) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "The email is too short.", err: true});
        if(!re.test(email)) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: `${email} is not a valid email.`, err: true});
        email = email.toLowerCase();

        //password validation
        let re2 = /\s/i
        if(!password) throw `Please enter your password`;
        if(re2.test(password)) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Spaces are not allowed in passwords.", err: true});
        if(password.length < 6) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Password is too short.", err: true});

        //name validation
        let re3 = /[A-Z0-9]/i
        firstName = firstName.trim();
        lastName = lastName.trim();
        if(firstName == "" || firstName == undefined) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your first name.", err: true});
        if(!re3.test(firstName)) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Your name should not contain special characters.", err: true});
        if(lastName == "" || lastName == undefined) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your last name.", err: true});
        if(!re3.test(lastName)) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Your name should not contain special characters.", err: true});

        //phone validation
        let re4 = /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
        phone = phone.trim();
        if(phone == "" || phone == undefined) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your first name.", err: true});
        if(!re4.test(phone)) res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Your name should not contain special characters.", err: true});

        try {
            let output = await recruiterDat.createRecruiter(email, password, firstName, lastName, phone);
            if(output.email) {
                req.session.user = username;
                return res.redirect('/private');
            }
        } catch (e) {
            return res.status(e.status).render('partials/signupform', {title: "Sign Up/Register", message: e.message, err: true});
        }
    }
});

router.get('/profile', async (req, res) => {
    let {id} = req.body;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.getRecruiter(id);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.get('/jobs', async (req,res) => {
    let {id} = req.body;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.getJobsByRecruiter(id);
            return res.json(output);
        } else {
            return res.status(400).render('partials/rec', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.post('/profile/create', async (req, res) => {
    if (req.session.user) return res.redirect('/private')
    else {
        let {id, profile} = req.body;
        let {gender, photo, city, state, company, about} = profile;

        //gender validation
        let re = /[A-Z]/i
        gender = gender.trim();
        if(gender == "" || gender == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your gender."});
        if(!re.test(gender)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Your gender should not contain special characters."});
        if(gender.length != 1) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter a valid gender."});

        //company validation
        let {position, companyName} = company;
        let re2 = /[A-Z0-9.-]/i
        position = position.trim();
        companyName = companyName.trim();
        if(companyName == "" || companyName == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your place of work."})
        if(re2.test(companyName)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${companyName} is not a valid company.`});
        if(position == "" || position == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your position."})
        if(re2.test(position)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${position} is not a valid position at ${companyName}.`});

        //city validation
        let re3 = /[A-Z-]/i
        city = city.trim();
        state = state.trim();
        if(city == "" || city == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(city)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${city} is not a valid city.`});
        if(state == "" || state == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(state)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${state} is not a valid state.`});

        try {
            if(ObjectId.isValid(id)) {
                let output = await recruiterDat.createProfile(id, profile);
                return res.json(output);
            } else {
                return res.status(400).render('partials/profilepage', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
            }
            
        } catch (e) {
            return res.status(e.status).render('partials/profilepage', {title: "Error", message: e.message, err: true});
        }
    }
});

router.patch('/profile/update', async (req, res) => {
    if (req.session.user) return res.redirect('/private')
    else {
        let {id, profile} = req.body;
        let {gender, photo, city, state, company, about} = profile;

        //gender validation
        let re = /[A-Z]/i
        gender = gender.trim();
        if(gender == "" || gender == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your gender."});
        if(!re.test(gender)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Your gender should not contain special characters."});
        if(gender.length != 1) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter a valid gender."});

        //company validation
        let {position, companyName} = company;
        let re2 = /[A-Z0-9.-]/i
        position = position.trim();
        companyName = companyName.trim();
        if(companyName == "" || companyName == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your place of work."})
        if(re2.test(companyName)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${companyName} is not a valid company.`});
        if(position == "" || position == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your position."})
        if(re2.test(position)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${position} is not a valid position at ${companyName}.`});

        //city validation
        let re3 = /[A-Z-]/i
        city = city.trim();
        state = state.trim();
        if(city == "" || city == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(city)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${city} is not a valid city.`});
        if(state == "" || state == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(state)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${state} is not a valid state.`});

        try {
            if(ObjectId.isValid(id)) {
                let output = await recruiterDat.updateProfile(id, profile);
                return res.json(output);
            } else {
                return res.status(400).render('partials/profilepage', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
            }
        } catch (e) {
            return res.status(e.status).render('partials/profilepage', {title: "Error", message: e.message, err: true});
        }
    }
});

router.delete('/', async (req, res) => {
    let {id} = req.body;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.removeRecruiter(id);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

module.exports = router;