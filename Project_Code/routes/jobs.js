const express = require('express');
const router = express.Router();
const data = require('../data');

const jobData = data.jobs;

router.get('/', async (req, res) => {
    try{

        const result = await jobData.getAllJobs();
        for(let i = 0 ;i < result.length; i ++){
            result[i].unique = String(result[i]._id);

       }       
       console.log(result);
        res.render('pages/home',{jobs: result});

    }catch(e){

        res.status(500).json({error : "Internal Server Error"});

    }
    
});

router.get('/jobs/city/:city', async (req, res) => {
    try{

        const result = await jobData.getJobByCity(req.params.city);
        res.json(result);

    }catch(e){

      console.log(e);

    }
    
});

router.get('/jobs/id/:id', async (req, res) => {
    try{

        const result = await jobData.getJobsById(req.params.id);
        res.render('pages/singleJob',{data : result});

    }catch(e){

    }
    
});

router.get('/jobs/state/:state', async (req, res) => {
    try{

        const result = await jobData.getJobByState(req.params.state);
        res.json(result);

    }catch(e){

    }
    
});

module.exports = router;
    


// to write a route for patching the database using the update function from the job data file ;


