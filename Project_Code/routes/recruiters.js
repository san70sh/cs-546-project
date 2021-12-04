const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const recruiterDat = require("../data/recruiters");

router.post('/login', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
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
                req.session.user = output.id;
                // return res.redirect('/private');
                return res.json(output);
            }
        } catch (e) {
            return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
        }
    // }
});

router.post('/accept', async (req, res) => {
    try {
        // if(!req.session.user) {
        //     return res.status(403).render('partials/loginform', {title: "Login Page", message: "Unauthorized Access", err: true})
        // } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.acceptDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        // }
    } catch (e) {
        return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
    }
});

router.post('/reject', async (req, res) => {
    try {
        // if(!req.session.user) {
        //     return res.status(403).render('partials/loginform', {title: "Login Page", message: "Unauthorized Access", err: true})
        // } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.rejectDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        // }
    } catch (e) {
        return res.status(e.status).render('partials/loginform', {title: "Login Page", message: e.message, err: true});
    }
});

router.post('/signup', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let {email, password, firstName, lastName, phone} = req.body;
        //Email validation
        let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
        if(email == "" || email == undefined) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your email.", err: true});
        if(email.length < 6) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "The email is too short.", err: true});
        if(!re.test(email)) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: `${email} is not a valid email.`, err: true});
        email = email.toLowerCase();

        //password validation
        let re2 = /\s/i
        if(!password) return res.status(400).render('partials/signupform',{title: "Sign Up/Register", message: `Please enter your password`});
        if(re2.test(password)) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Spaces are not allowed in passwords.", err: true});
        if(password.length < 6) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Password is too short.", err: true});

        //name validation
        let re3 = /[A-Z0-9]/i
        firstName = firstName.trim();
        lastName = lastName.trim();
        if(firstName == "" || firstName == undefined) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your first name.", err: true});
        if(!re3.test(firstName)) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Your name should not contain special characters.", err: true});
        if(lastName == "" || lastName == undefined) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your last name.", err: true});
        if(!re3.test(lastName)) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Your name should not contain special characters.", err: true});

        //phone validation
        let re4 = /^[0-9]+$/
        phone = phone.trim();
        if(phone == "" || phone == undefined) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Please enter your phone number.", err: true});
        if(phone.length != 10) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Invalid phone number.", err: true});
        if(!re4.test(phone)) return res.status(400).render('partials/signupform', {title: "Sign Up/Register", message: "Invalid phone number.", err: true});

        try {
            let output = await recruiterDat.createRecruiter(email, password, firstName, lastName, phone);
            if(output.recFound) {
                req.session.user = output.data._id;
                return res.json(output);
                // return res.redirect('/private');
            }
        } catch (e) {
            return res.status(e.status).render('partials/signupform', {title: "Sign Up/Register", message: e.message, err: true});
        }
    // }
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    if(ObjectId.isValid(id)) {
        let output = await recruiterDat.getRecruiter(id);
        return res.json(output);
    }
});

router.get('/profile/:id', async (req, res) => {
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

router.get('/jobs/:id', async (req,res) => {
    let id = req.params.id;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.getJobsByRecruiterId(id);
            return res.json(output);
        } else {
            return res.status(400).render('partials/rec', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.post('/profile/:id', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let id = req.params.id;
        let {gender, photo, city, state, company, about} = req.body;

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
        if(!re2.test(companyName)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${companyName} is not a valid company.`});
        if(position == "" || position == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your position."})
        if(!re2.test(position)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${position} is not a valid position at ${companyName}.`});

        //city validation
        let re3 = /[A-Z-]/i
        city = city.trim();
        state = state.trim();
        if(city == "" || city == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(!re3.test(city)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${city} is not a valid city.`});
        if(state == "" || state == undefined) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(!re3.test(state)) return res.status(400).render('partials/profilepage', {title: "Create Profile", message: `${state} is not a valid state.`});

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
    // }
});

router.patch('/profile/:id', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let id = req.params.id;
        let {gender, photo, city, state, company, about} = req.body;

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
    // }
});

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.removeRecruiter(id);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.post('/jobs/:id', async (req, res) => {
    let id = req.params.id;
    let {title, type, company, city, state, postDate, expiryDate, details, payRange} = req.body;

    if(!title || typeof title !== 'string' || title.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid title`});
    if(!type || typeof type !== 'string' || type.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid JobType`});
    if(!company || typeof company !== 'string' || company.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid company`});
    if(!city || typeof city !== 'string' || city.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid city`});
    if(!state || typeof state !== 'string' || state.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid state`});

    let {summary, description, required} = details;

    if(!summary || typeof summary !== 'string' || summary.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!description || typeof description !== 'string' || description.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!required || required.length < 1 ) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid required skilset in details`});

    let currentDay = new Date();
    if(!postDate|| typeof postDate !== 'object') return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `please provide a valid post date`});
    if(!expiryDate|| typeof expiryDate !== 'object'|| +expiryDate < +currentDay) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `please provide a valid expiry date`});

    let re = /^[0-9]+ - [0-9]+$/
    if(!re.test(payRange)) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    let payrangeArr = payRange.toArray();
    if(parseInt(payrangeArr[0].trim()) > parseInt(payrangeArr[2].trim())) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.postJob(id, jobDetails);
            return res.json(output);
        }
    } catch(e) {
        return res.status(e.status).render('partials/jobpost', {title: "Error", message: e.message, err: true});
    }
});

router.patch('/jobs/:id', async (req, res) => {
    let jobId = req.params.id;
    let {userId, jobDetails} = req.body;

    let {title, type, company, city, state, postDate, expiryDate, details, payRange} = jobDetails;

    if(!title || typeof title !== 'string' || title.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid title`});
    if(!type || typeof type !== 'string' || type.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid JobType`});
    if(!company || typeof company !== 'string' || company.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid company`});
    if(!city || typeof city !== 'string' || city.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid city`});
    if(!state || typeof state !== 'string' || state.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid state`});

    let {summary, description, required} = details;

    if(!summary || typeof summary !== 'string' || summary.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!description || typeof description !== 'string' || description.trim().length < 1) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!required || required.length < 1 ) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `Please provide a valid required skilset in details`});

    let currentDay = new Date();
    if(!postDate|| typeof postDate !== 'object') return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `please provide a valid post date`});
    if(!expiryDate|| typeof expiryDate !== 'object'|| +expiryDate < +currentDay) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: `please provide a valid expiry date`});

    let re = /^[0-9]+ - [0-9]+$/
    if(!re.test(payRange)) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    let payrangeArr = payRange.toArray();
    if(parseInt(payrangeArr[0].trim()) > parseInt(payrangeArr[2].trim())) return res.status(400).render('partials/jobpost', {title: "Invalid Job", message: "Invalid payrange"});

    try {
        if(ObjectId.isValid(userId) || ObjectId.isValid(jobId)) {
            let output = await recruiterDat.updateJob(userId, jobId, jobDetails);
            return res.json(output);
        }
    } catch(e) {
        return res.status(e.status).render('partials/jobpost', {title: "Error", message: e.message, err: true});
    }
});

router.delete('/jobs/:id', async (req, res) => {
    let jobId = req.params.id;
    try {
        if(ObjectId.isValid(jobId)) {
            let userId = req.session.user;
            let output = await recruiterDat.removeJob(userId, jobId);
            return res.json(output);
        }
    } catch (e) {
        return res.status(e.status).render('partials/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

module.exports = router;