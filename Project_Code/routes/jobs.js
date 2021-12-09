const express = require("express");
const session = require("express-session");
const router = express.Router();
const data = require("../data");
const users = data.users;
const jobData = data.jobs;

router.get("/", async (req, res) => {
  try {
    const result = await jobData.getAllJobs();
    for (let i = 0; i < result.length; i++) {
      result[i].unique = String(result[i]._id);
    }
    console.log(result);
    res.render("pages/home", { jobs: result });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/jobs/city/:city", async (req, res) => {
  try {
    const result = await jobData.getJobByCity(req.params.city);
    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

router.get("/jobs/id/:id", async (req, res) => {
  try {
    if(!req.session.user || req.session.user.type != 'user'){
      //alert("PLEASE LOGIN FIRST");
      return res.render('pages/home',{errorclass: true});
    }
    const result = await jobData.getJobsById(req.params.id);
    const jobId = req.params.id;
    console.log(jobId);
    res.render("pages/singleJob", { data: result, jobId: jobId });
  } catch (e) {}
});

/*
router.post("/jobs/id/:id/apply", async (req, res) => {
  // await users.apply(req.params.id,)
  res.status(200).send("success!");
});
*/
router.get("/jobs/state/:state", async (req, res) => {
  try {
    const result = await jobData.getJobByState(req.params.state);
    res.json(result);
  } catch (e) {}
});

router.get('/logout', (req, res) => {
  if(req.session.user){
      req.session.destroy((function(err){
          res.clearCookie('AuthCookie').render('pages/logout');
  
      }));
      return;
  }
  else{
      res.render('pages/error');
      return;
  }

});

router.get("/jobs/recruiters/id/:id", async (req, res) => {
  try {
    if(!req.session.user || req.session.user.type != 'recruiter'){
      //alert("PLEASE LOGIN FIRST");
      return res.render('pages/home',{errorclass: true});
    }
    const result = await jobData.getJobsById(req.params.id);
    const jobId = req.params.id;
    console.log(jobId);
    res.render("pages/recJob", { data: result, jobId: jobId });
  } catch (e) {
    // write a function here to render page heere
    
  }
});

module.exports = router;

// to write a route for patching the database using the update function from the job data file ;
