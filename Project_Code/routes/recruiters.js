const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const recruiterDat = require("../data/recruiters");
const jobDat = require("../data/jobs");
const usrDat = require("../data/users");
router.get('/login', async (req, res) => {
    // $("#reclogin").show("modal");
    return res.render('pages/recruiterlogin', {title:"Recruiter Login"});
});

router.get('/signup', async (req, res) => {
    // $("#reclogin").show("modal");
    return res.render('pages/recruiterSignup', {title:"Recruiter Sign-up"});
})

router.post('/login', async (req, res) => {
    console.log(req.body);
    // if (req.session.user) return res.redirect('/private')
    // else {
        let {email, password} = req.body;
        let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
        if(email == "" || email == undefined) return res.status(400).render('pages/recruiterlogin', {message: "Please enter your email.", emailerr: true});
        if(email.length < 6) return res.status(400).render('pages/recruiterlogin', {message: "The email is too short.", emailerr: true});
        if(!re.test(email)) return res.status(400).render('pages/recruiterlogin', {message: `${email} is not a valid email.`, emailerr: true});

        //password validation
        let re2 = /\s/i
        if(!password) throw `Please enter your password`;
        if(re2.test(password)) return res.status(400).render('pages/recruiterlogin', {message: "Spaces are not allowed in passwords.", pwderr: true});
        if(password.length < 6) return res.status(400).render('pages/recruiterlogin', {message: "Password is too short.", pwderr: true});

        try {
            let output = await recruiterDat.recruiterCheck(email, password);
            if(output.authenticated) {
                let recruiter = await recruiterDat.getRecruiter(output.id);
                // req.session.user = output.id;
                // return res.redirect('/private');
                return res.redirect(`/recruiters/${output.id}`);
            }
        } catch (e) {
            return res.render('pages/recruiterlogin', {message: e.message, mainerr: true});
        }
    // }
});

router.post('/accept', async (req, res) => {
    try {
        // if(!req.session.user) {
        //     return res.status(403).render('partials/loginform', {, message: "Unauthorized Access", err: true})
        // } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.acceptDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        // }
    } catch (e) {
        console.log(e);
        return res.status(e.status).render('partials/loginform', {message: e.message, err: true});
    }
});

router.post('/reject', async (req, res) => {
    try {
        // if(!req.session.user) {
        //     return res.status(403).render('partials/loginform', {, message: "Unauthorized Access", err: true})
        // } else {
            let {recruiterId, applicantId, jobId} = req.body;
            if(ObjectId.isValid(recruiterId) && ObjectId.isValid(applicantId) && ObjectId.isValid(jobId)) {
                let output = await recruiterDat.rejectDecision(recruiterId, applicantId, jobId);
                res.json(output);
            }
        // }
    } catch (e) {
        return res.status(e.status).render('partials/loginform', {message: e.message, err: true});
    }
});

router.post('/signup', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let {email, password, firstName, lastName, phone} = req.body;
        //Email validation
        let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
        if(email == "" || email == undefined) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Please enter your email.", emailerr: true});
        if(email.length < 6) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "The email is too short.", emailerr: true});
        if(!re.test(email)) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: `${email} is not a valid email.`, emailerr: true});
        email = email.toLowerCase();

        //password validation
        let re2 = /\s/i
        if(!password) return res.status(400).render('pages/recruiterSignup',{title: "Sign Up/Register", message: `Please enter your password`, pwderr: true});
        if(re2.test(password)) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Spaces are not allowed in passwords.", pwderr: true});
        if(password.length < 6) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Password is too short.", pwderr: true});

        //name validation
        let re3 = /[A-Z]/i
        firstName = firstName.trim();
        lastName = lastName.trim();
        if(firstName == "" || firstName == undefined) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Please enter your first name.", fnerr: true});
        if(!re3.test(firstName)) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Your name should not contain special characters.", fnerr: true});
        if(lastName == "" || lastName == undefined) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Please enter your last name.", lnerr: true});
        if(!re3.test(lastName)) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Your name should not contain special characters.", lnerr: true});

        //phone validation
        let re4 = /[0-9]{10}/
        phone = phone.trim();
        if(phone == "" || phone == undefined) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Please enter your phone number.", pherr: true});
        if(phone.length != 10) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Invalid phone number.", pherr: true});
        if(!re4.test(phone)) return res.status(400).render('pages/recruiterSignup', {title: "Sign Up/Register", message: "Invalid phone number.", pherr: true});

        try {
            let recruiter = await recruiterDat.createRecruiter(email, password, firstName, lastName, phone);
            if(recruiter.recFound) {
                req.session.user = recruiter.data._id;
                let profileCreated = true;
                if(!recruiter.data.profile){
                    profileCreated = false;
                }
                return res.redirect(`/recruiters/${recruiter.data._id}`);
            }
        } catch (e) {
            return res.status(e.status).render('pages/recruiterSignup', {title: "Sign Up/Register", message: e.message, mainerr: true});
        }
    // }
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    if(ObjectId.isValid(id)) {
        let recruiter = await recruiterDat.getRecruiter(id);
        let applicantList = [];
        await Promise.all(recruiter.data.jobs.map(async (e) => {
            e.applicant_id.map(async (e) => {
                e = e.toString();
                let appDetails = await usrDat.get(e);
                applicantList.push(appDetails);
            })
            let job = await jobDat.getJobsById(e.job_id.toString());
            e["jobDetails"] = job;
            e["applicants"] = applicantList;
            e.job_id = e.job_id.toString();
        }));
        return res.render('pages/recruiterProfile',{recruiter: recruiter.data, jobs: recruiter.data.jobs});
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
        return res.status(e.status).render('pages/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.get('/jobs/:id', async (req,res) => {
    let id = req.params.id;
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.getJobsByRecruiterId(id);
            return res.json(output);
        } else {
            return res.status(400).render('pages/rec', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
        }
    } catch (e) {
        return res.status(e.status).render('pages/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.post('/profile/:id', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let id = req.params.id;
        let {gender, photo, city, state, company} = req.body;

        //gender validation
        let re = /[A-Z]/i
        gender = gender.trim();
        if(gender == "" || gender == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your gender."});
        if(!re.test(gender)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Your gender should not contain special characters."});
        if(gender.length != 1) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter a valid gender."});

        //company validation
        let {position, name, description} = company;
        let re2 = /[A-Z0-9.-]/i
        position = position.trim();
        name = name.trim();
        if(name == "" || name == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your place of work."})
        if(!re2.test(name)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${name} is not a valid company.`});
        if(position == "" || position == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your position."})
        if(!re2.test(position)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${position} is not a valid position at ${name}.`});

        //city validation
        let re3 = /[A-Z-]/i
        city = city.trim();
        state = state.trim();
        if(city == "" || city == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(!re3.test(city)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${city} is not a valid city.`});
        if(state == "" || state == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(!re3.test(state)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${state} is not a valid state.`});

        try {
            if(ObjectId.isValid(id)) {
                let profile = {"gender": gender, "photo": photo, "city": city, "state": state, "company": {"position": position, "name": name, "description": description}}
                let output = await recruiterDat.createProfile(id, profile);
                return res.json(output);
            } else {
                return res.status(400).render('pages/profilepage', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
            }
            
        } catch (e) {
            console.log(e);
            return res.status(e.status).render('pages/profilepage', {title: "Error", message: e.message, err: true});
        }
    // }
});

router.patch('/profile/:id', async (req, res) => {
    // if (req.session.user) return res.redirect('/private')
    // else {
        let id = req.params.id;
        let {gender, photo, city, state, company} = req.body;

        //gender validation
        let re = /[A-Z]/i
        gender = gender.trim();
        if(gender == "" || gender == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your gender."});
        if(!re.test(gender)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Your gender should not contain special characters."});
        if(gender.length != 1) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter a valid gender."});

        //company validation
        let {position, name, description} = company;
        let re2 = /[A-Z0-9.-]/i
        position = position.trim();
        name = name.trim();
        if(name == "" || name == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your place of work."})
        if(re2.test(name)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${name} is not a valid company.`});
        if(position == "" || position == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your position."})
        if(re2.test(position)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${position} is not a valid position at ${name}.`});

        //city validation
        let re3 = /[A-Z-]/i
        city = city.trim();
        state = state.trim();
        if(city == "" || city == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(city)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${city} is not a valid city.`});
        if(state == "" || state == undefined) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: "Please enter your location of work."});
        if(re3.test(state)) return res.status(400).render('pages/profilepage', {title: "Create Profile", message: `${state} is not a valid state.`});

        try {
            if(ObjectId.isValid(id)) {
                let output = await recruiterDat.updateProfile(id, profile);
                return res.json(output);
            } else {
                return res.status(400).render('pages/profilepage', {title: "Invalid User", message: "Invalid Recruiter ID", err: true});
            }
        } catch (e) {
            return res.status(e.status).render('pages/profilepage', {title: "Error", message: e.message, err: true});
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
        return res.status(e.status).render('pages/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

router.post('/jobs/:id', async (req, res) => {
    let id = req.params.id;
    let {title, type, company, city, state, postDate, expiryDate, details, payRange} = req.body;

    if(!title || typeof title !== 'string' || title.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid title`});
    if(!type || typeof type !== 'string' || type.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid JobType`});
    if(!company || typeof company !== 'string' || company.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid company`});
    if(!city || typeof city !== 'string' || city.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid city`});
    if(!state || typeof state !== 'string' || state.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid state`});

    let {summary, description, required} = details;

    if(!summary || typeof summary !== 'string' || summary.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!description || typeof description !== 'string' || description.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!required || required.length < 1 ) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid required skilset in details`});

    let currentDay = new Date();
    if(!postDate|| typeof postDate !== 'object') return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `please provide a valid post date`});
    if(!expiryDate|| typeof expiryDate !== 'object'|| +expiryDate < +currentDay) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `please provide a valid expiry date`});

    let re = /^[0-9]+ - [0-9]+$/
    if(!re.test(payRange)) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    let payrangeArr = payRange.toArray();
    if(parseInt(payrangeArr[0].trim()) > parseInt(payrangeArr[2].trim())) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    
    try {
        if(ObjectId.isValid(id)) {
            let output = await recruiterDat.postJob(id, jobDetails);
            return res.json(output);
        }
    } catch(e) {
        return res.status(e.status).render('pages/jobpost', {title: "Error", message: e.message, err: true});
    }
});

router.patch('/jobs/:id', async (req, res) => {
    let jobId = req.params.id;
    let {userId, jobDetails} = req.body;

    let {title, type, company, city, state, postDate, expiryDate, details, payRange} = jobDetails;

    if(!title || typeof title !== 'string' || title.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid title`});
    if(!type || typeof type !== 'string' || type.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid JobType`});
    if(!company || typeof company !== 'string' || company.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid company`});
    if(!city || typeof city !== 'string' || city.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid city`});
    if(!state || typeof state !== 'string' || state.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid state`});

    let {summary, description, required} = details;

    if(!summary || typeof summary !== 'string' || summary.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!description || typeof description !== 'string' || description.trim().length < 1) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid summary in details`});
    if(!required || required.length < 1 ) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `Please provide a valid required skilset in details`});

    let currentDay = new Date();
    if(!postDate|| typeof postDate !== 'object') return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `please provide a valid post date`});
    if(!expiryDate|| typeof expiryDate !== 'object'|| +expiryDate < +currentDay) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: `please provide a valid expiry date`});

    let re = /^[0-9]+ - [0-9]+$/
    if(!re.test(payRange)) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: "Invalid payrange"});
    let payrangeArr = payRange.toArray();
    if(parseInt(payrangeArr[0].trim()) > parseInt(payrangeArr[2].trim())) return res.status(400).render('pages/jobpost', {title: "Invalid Job", message: "Invalid payrange"});

    try {
        if(ObjectId.isValid(userId) || ObjectId.isValid(jobId)) {
            let output = await recruiterDat.updateJob(userId, jobId, jobDetails);
            return res.json(output);
        }
    } catch(e) {
        return res.status(e.status).render('pages/jobpost', {title: "Error", message: e.message, err: true});
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
        return res.status(e.status).render('pages/rec', {title: "Invalid User", message: e.message, err: true});
    }
});

module.exports = router;