const express = require('express');
const router = express.Router();
const data = require('../data');

const jobData = data.jobs;

router.get('/', async (req, res) => {
    try{

        const result = await jobData.getAllJobs();
        return result;

    }catch(e){

    }
    
});

router.get('/:city', async (req, res) => {
    try{

        const result = await jobData.getJobByCity(req.params.city);
        return result;

    }catch(e){

    }
    
});

router.get('/:id', async (req, res) => {
    try{

        const result = await jobData.getJobByCity(req.params.id);
        return result;

    }catch(e){

    }
    
});

router.get('/:location', async (req, res) => {
    try{

        const result = await jobData.getJobByCity(req.params.location);
        return result;

    }catch(e){

    }
    
});

router.get('/:city', async (req, res) => {
    try{

        const result = await jobData.getJobByCity(req.params.city);
        return result;

    }catch(e){

    }
    
});

router.post('/jobs/:id', async (req, res) => {
    try{

        // to check if we are passing this in the req.body
        const result = await jobData.createJob(req.params.city);
        return result;

    }catch(e){

    }
    
});

router.delete('/jobs/:id', async (req, res) => {
    // this route is to delete the job by id and render something
    try{
         
        const result = await jobData.deleteJob(req.params.id);
        return result;

    }catch(e){

    }
    
});

// to write a route for patching the database using the update function from the job data file ;


