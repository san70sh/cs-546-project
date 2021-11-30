/* 
dbname : 'JobHunt_db'

Variables: recruiterId, 

#################################################################################

SPECS:

Recruiters Functions


createProfile(userId, photo, gender, city, state, company)
This function is used to create sub-document profile for the recruiter with userId, All fields need to match the type specified in DB_proposal. It will return newly created profile.

create(email, phone, firstname, lastname, password, profile)
Used to create an account for user:
please create unique username and password in the keystore as well.
Please make sure you tag it with respect to recruiter and users


loginCheck(username, password)

all the fields must be valid except for profile.
if profile is empty, set it with empty object.
For profile, it should be an object(all fields must be valid) and we use createProfile to help us create the recruiter's profile.
jobs will be initialized with empty arrays.
password must be encoded and then be saved to database. (encode and decode function to be determined later)
will return newly created recruiter info.
update and updateProfile will have the same logic with previous functions


update and updateProfile will have the same logic with previous functions
post(title, type, company, contact, city, state, expiryDate, details, payRange, companyPic)
All the fields must match fields in DB_proposal, except for payRange and companyPic, they are optional features.

If payRange or companyPic are not given, set it with empty string.

details should be an object, it's a sub-document of this job.

"details": {
"summary":"This is a abc company",
"description":"This a devops role your responsibilities will be abc",
"required":["Java","Mongodb"],
"benefits":"you will get travelling allowance,insurance etc."
},
Automatically set postDate to today's date and poster to the recruiter.

Return the newly added job.

Example of a job:

"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
"title":"Software development summer 2022 internship"
"type": "internship",
"company: "Stevens",
"poster": "get it from recruiter id from recruiter collection",
"contact": "stevens.edu",
"city": "Hoboken",
"state": "NJ",
“postDate”: "today's date in MM/DD/YYYY,
"expiryDate":"MM/DD/YYY"
"details": {
  "summary":"This is a abc company",
  "description":"This a devops role your responsibilities will be abc",
  "required":["Java","Mongodb"],
  "benefits":"you will get travelling allowance,insurance etc."
},
  "pay range":" 50 - 100 $ PER HOUR"
  "companyPic": "image/pdf url"


updateJob(jobId, title, type, company, contact, city, state, expiryDate, details, payRange, companyPic)
Similar with post.

removeJob(jobId)
Remove all the applicants applied with this job.
Remove saved jobs with this id
Remove this job.

removeAllJob()
Recursively use removeJob(jobId).

remove(id)(which used to remove one recruiter)
remove will take the following steps:

With this id, first find the jobs field, then find the applicantId under jobs, remove these applicants applied jobs in user collection.
Remove jobs posted by this recruiter from job collection. (Step 1 and step 2 can use removeAllJob)
Remove recruiter with this idfine.
If the removal succeeds, return the name of the user and the text " has been successfully deleted!".

viewJob(jobId)

accept(applicantId, jobId)(used to accept or reject applicants' applications)
change the status this job under applicant's jobs to accepted

reject(applicantId, jobId)
change the status this job under applicant's jobs to "rejected"



*/


/*
Methods:
  createRecruiter(email, password, firstname, lastName, phone)
    Inserts recruiter object in database -> Returns Recruiter object after insertion
  
  getRecruiter(id)
    Retrieves recruiter record based on ID passed -> Returns recruiter object
  
  createProfile(recruiterId, profile)
    Creates profile subdocument of recruiter based on recruiterId and data in profile object passed ->  Returns recruiter record with inserted profile
  
  recruiterCheck(email, password)
    Checks if passed email and password are a match in database -> Returns {"authenticated": true} if matched.

  updateProfile(recruiterId, profile
    Updates profile subdocument of recruiter based on recruiterId and data in profile object passed ->  Returns recruiter record with updated profile
  
  removeRecruiter(id)
    Removes recruiter record from database along with associated data in jobs and users collection -> Returns "Successfully removed"
  
  postJob(id, jobDetails)
    Creates a new job post by recruiter by passing recruiterId and job related details into createJob methods in jobs -> Returns "Sucessfully created" for now (Should return/redirect to jobs page)



*/

const mongoCollections = require('../config/mongoCollections');
const jobMethods = require('./jobs');
const recruiters = mongoCollections.recruiters;
const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');
const usrs = mongoCollections.users;
const jobs = mongoCollections.jobs;
const saltRounds = 16;


function CustomError (status, message) {
  this.status = status;
  this.message = message;
}

async function createRecruiter(email, password, firstName, lastName, phone) {
  //Email validation
  let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
  if(email == "" || email == undefined) throw new CustomError(400,"Please enter your email.");
  if(email.length < 6) throw new CustomError(400,"The email is too short.");
  if(!re.test(email)) throw new CustomError(400,`${email} is not a valid email.`);
  email = email.toLowerCase();

  //password validation
  let re2 = /\s/i
  if(!password) throw `Please enter your password`;
  if(re2.test(password)) throw new CustomError(400,"Spaces are not allowed in passwords.");
  if(password.length < 6) throw new CustomError(400,"Password is too short.");

  //name validation
  let re3 = /[A-Z0-9]/i
  firstName = firstName.trim();
  lastName = lastName.trim();
  if(firstName == "" || firstName == undefined) throw new CustomError(400,"Please enter your first name.");
  if(!re3.test(firstName)) throw new CustomError(400,"Your name should not contain special characters.");
  if(lastName == "" || lastName == undefined) throw new CustomError(400,"Please enter your last name.");
  if(!re3.test(lastName)) throw new CustomError(400,"Your name should not contain special characters.");

  //phone validation
  let re4 = /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
  phone = phone.trim();
  if(phone == "" || phone == undefined) throw new CustomError(400,"Please enter your first name.");
  if(!re4.test(phone)) throw new CustomError(400,"Your name should not contain special characters.");


  const recruiterCol = await recruiters();
  let dupUser = await recruiterCol.findOne({"email": email})
  if(dupUser == null){
      let newRec = {
          email: email,
          password: await bcrypt.hash(password, saltRounds),
          firstName: firstName,
          lastName: lastName,
          phone: phone 
      }

      const insertInfo = await recruiterCol.insertOne(newRec);
      if (insertInfo.insertedCount === 0) {
          throw new CustomError(500,'Internal Server Error');
      } else {
          let insertedId = insertInfo.insertedId;
          let returnObj = await this.get(insertedId.toString());
          return returnObj;
      }
  } else {
      throw new CustomError(400,`Username with ${email} already exists in the database.`);
  }
}

async function getRecruiter(id) {

  //ID validation
  if(ObjectId.isValid(id)) {
    const recruiterCol = await recruiters();
    let recruiter = await recruiterCol.findOne({"_id": new ObjectId(id)});
    if (recruiter) {
        return recruiter;
    } else {
      let returnObj = {"recFound": false}
        return returnObj;
    }
  } else throw new CustomError(400, `${id} is not a valid ID`)
  
}

async function getJobsByRecruiter(id) {
  if(ObjectId.isValid(id)) {
    const recruiterCol = await recruiters();
    let recruiter = await recruiterCol.findOne({"_id": new ObjectId(id)});
    if (recruiter) {
        return recruiter.jobs;
    } else {
      let returnObj = {"unauthorised": true}
        return returnObj;
    }
  } else throw new CustomError(400, `${id} is not a valid ID`)
  
}
async function createProfile(recruiterId, profile) {
  const recruiterCol = await recruiters();

  let {gender, photo, city, state, company, about} = profile
  let recruiter = await getRecruiter(recruiterId);
  //gender validation
  let re = /[A-Z]/i
  gender = gender.trim();
  if(gender == "" || gender == undefined) throw new CustomError(400,"Please enter your gender.");
  if(!re.test(gender)) throw new CustomError(400,"Your gender should not contain special characters.");
  if(gender.length != 1) throw new CustomError(400,"Please enter a valid gender.");

  //company validation
  let {position, companyName} = company;
  let re2 = /[A-Z0-9.-]/i
  position = position.trim();
  companyName = companyName.trim();
  if(companyName == "" || companyName == undefined) throw new CustomError(400,"Please enter your place of work.")
  if(re2.test(companyName)) throw new CustomError(400,`${companyName} is not a valid company.`);
  if(position == "" || position == undefined) throw new CustomError(400,"Please enter your position.")
  if(re2.test(position)) throw new CustomError(400,`${position} is not a valid position at ${companyName}.`);

  //city validation
  let re3 = /[A-Z-]/i
  city = city.trim();
  state = state.trim();
  if(city == "" || city == undefined) throw new CustomError(400,"Please enter your location of work.")
  if(re3.test(city)) throw new CustomError(400,`${city} is not a valid city.`);
  if(state == "" || state == undefined) throw new CustomError(400,"Please enter your location of work.")
  if(re3.test(state)) throw new CustomError(400,`${state} is not a valid state.`);

  if(!recruiter.recFound) {

    let newProfile = {
      gender: gender,
      city: city,
      state: state,
      about: about,
      company: company,
      photo: photo
    }
    const recruiterUpdate = await recruiterCol.updateOne({ _id: recruiter._id }, { $set: { profile: newProfile } });
    if (recruiterUpdate.modifiedCount === 0) {
      throw `The recruiter's profile could not be created.`;
    } else {
        return await getRecruiter(recruiterId);
    }
  } else {
    throw `This recruiter does not exist in the database.`;
  }
}

async function recruiterCheck(email, password) {

  //Email validation
  let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
  if(email == "" || email == undefined) throw new CustomError(400,"Please enter your email.");
  if(email.length < 6) throw new CustomError(400,"The email is too short.");
  if(!re.test(email)) throw new CustomError(400,`${email} is not a valid email.`);
  email = email.toLowerCase();

  //password validation
  let re2 = /\s/i
  if(!password) throw `Please enter your password`;
  if(re2.test(password)) throw new CustomError(400,"Spaces are not allowed in passwords.");
  if(password.length < 6) throw new CustomError(400,"Password is too short.");

  const recruiterCol = await recruiters();
  let validateRecruiter = await recruiterCol.findOne({"email": email})
    if(validateRecruiter == null) throw new CustomError(400,"Either the username or password is invalid");
    else {
        if(await bcrypt.compare(password, validateRecruiter.password)){
            let returnObj = {"authenticated": true};
            return returnObj;
        } else throw new CustomError(400,"Either the username or password is invalid");
    }

}

async function updateProfile(recruiterId, profile) {
  const recruiterCol = await recruiters();
  if(ObjectId.isValid(recruiterId)) {
    let recruiter = await getRecruiter(recruiterId);

    let {gender, photo, city, state, company, about} = profile;
    //gender validation
    let re = /[A-Z]/i
    gender = gender.trim();
    if(gender == "" || gender == undefined) throw new CustomError(400,"Please enter your gender.");
    if(!re.test(gender)) throw new CustomError(400,"Your gender should not contain special characters.");
    if(gender.length != 1) throw new CustomError(400,"Please enter a valid gender.");

    //company validation
    let {position, companyName} = company;
    let re2 = /[A-Z0-9.-]/i
    position = position.trim();
    companyName = companyName.trim();
    if(companyName == "" || companyName == undefined) throw new CustomError(400,"Please enter your place of work.")
    if(re2.test(companyName)) throw `${companyName} is not a valid company.`;
    if(position == "" || position == undefined) throw new CustomError(400,"Please enter your position.")
    if(re2.test(position)) throw `${position} is not a valid position at ${companyName}.`;

    //city validation
    let re3 = /[A-Z-]/i
    city = city.trim();
    state = state.trim();
    if(city == "" || city == undefined) throw new CustomError(400,"Please enter your location of work.")
    if(re3.test(city)) throw `${city} is not a valid city.`;
    if(state == "" || state == undefined) throw new CustomError(400,"Please enter your location of work.")
    if(re3.test(state)) throw `${state} is not a valid state.`;

    if(!recruiter.recFound) {
      if(recruiter.profile.gender == gender && recruiter.profile.city == city && recruiter.profile.state == state
        && recruiter.profile.company == company) throw new CustomError(400,`No fields are being updated.`)
      else {
        let updatedProfile = {
          gender: gender,
          city: city,
          state: state,
          about: about,
          company: company,
          photo: photo
        }
        const recruiterUpdate = await recruiterCol.updateOne({ _id: recruiter._id }, { $set: { profile: updatedProfile } });
        if (recruiterUpdate.modifiedCount === 0) {
          throw `The recruiter's profile could not be updated.`;
        } else {
            return await getRecruiter(recruiterId);
        }
      }
    } else {
      throw `Recruiter with the email ${email} does not exist in the database.`;
    }
  } else {
    throw `This recruiter does not exist in the database.`;
  }
  
}

async function removeRecruiter(id) {
  const recruiterCol = await recruiters();
  const userCol = await usrs();
  const jobsCol = await jobs();
  
  if(ObjectId.isValid(id)) {
    let recruiter = await getRecruiter(id);
    if(recruiter){
      let recruiterJobs = [], appliedUsers = [],usrUpdate;
      recruiter.jobs.forEach(e => {
        recruiterJobs.push(e.job_id);
        appliedUsers.push(e.applicant_id);
      });
      let appliedUserSet = new Set(appliedUsers.flat());
      let jobDel = await jobsCol.deleteMany({_id: {$in:recruiterJobs}});
      if(jobDel.deletedCount === recruiterJobs.length) {
          usrUpdate = await userCol.updateMany({_id: {$in: [...appliedUserSet]}}, {$pull: {jobs: {job: {$in: recruiterJobs}}, favor: {$in: recruiterJobs}}})
        if(usrUpdate.modifiedCount === appliedUserSet.size) {
          const recruiterDeletion = await recruiterCol.deleteOne({ _id: new ObjectId(id) });
          if (recruiterDeletion.deletedCount === 0) {
              throw `The recruiter could not be removed.`;
          } else {
              return "Successfully removed";
          }
        }
      }
    } else throw `This Recruiter does not exist in the database.`;  
  }
}

async function postJob(id, jobDetails) {
  
  if(ObjectId.isValid(id)) {
    const recruiterCol = await recruiters();
    let recruiter = await getRecruiter(id);
    if(recruiter) {
      let resObj = await jobMethods.createJob(id, recruiter.email, jobDetails);
      const jobPost = await recruiterCol.updateOne({ _id: id }, { $push: { "jobs.job_id": resObj._id } });
      if (jobPost.modifiedCount === 0) {
        throw `The job could not be created.`;
      } else {
          return "Sucessfully created";
      }
    } else {
      throw `This Recruiter does not exist in the database.`;
    }
  }
}

async function updateJob(id, jobDetails) {
  
  if(ObjectId.isValid(id)) {
    let recruiter = await getRecruiter(id);
    if(recruiter) {
      let resObj = await jobMethods.updateJob(id, jobDetails);
      return resObj;
    } else {
      throw `Recruiter with the email ${email} does not exist in the database.`;
    }
  }
}

async function removeJob(id, jobId) {
  
  if(ObjectId.isValid(id)) {
    const recruiterCol = await recruiters();
    const userCol = await usrs();
    let recruiter = await getRecruiter(id);
    if(recruiter) {
      let resObj = await jobMethods.deleteJob(jobId);
      if(resObj) {
        jobId = new ObjectId(jobId);
        let applicants = await recruiterCol.find({"jobs.job_id": jobId}).project({_id: 0, jobs: {"applicant_id": 1}}).toArray();
        let appliedUserSet = [];
        if(applicants.length != 0) appliedUserSet = applicants[0].jobs[0].applicant_id;
        let usrUpdate = await userCol.updateMany({_id: {$in: [...appliedUserSet]}}, {$pull: {jobs: {job: {$eq: jobId}}, favor: {$eq: jobId}}})
        let jobDel = await recruiterCol.updateOne({ }, {$pull: { jobs: {job_id: jobId } } } )
        if(jobDel.modifiedCount === 0){
          throw `The job with ID ${jobId} could not be removed.`;
        } else {
          let jobD = {"jobId" : jobId.toString(), "deleted": true};
          return jobD; 
        }
      } else throw "Job could not be removed.";
    } else throw `This Recruiter does not exist in the database.`;
  }
}
async function acceptDecision(id, applicantId, jobId) {
  const userCol = await usrs();
  let recruiter = await getRecruiter(id);
  if(recruiter) {
    let jobList = await getJobsByRecruiter(id);
    if(jobList.some(e => e.job_id == new ObjectId(jobId))) {
      let applicant = await userCol.updateOne({$and: [{"_id": new ObjectId(applicantId)}, {"jobs.job": new ObjectId(jobId)}]}, {$set: {"jobs.$.status": "Accepted"}})
      if(applicant.modifiedCount === 1) {
        return "Applicant accepted";
      } else throw new CustomError(500,"Acceptance error");
    } else throw new CustomError(403,"Recruiter does not have this job");
  } else throw new CustomError(400,"Recruiter is not present in the database");
}

async function rejectDecision(id, applicantId, jobId) {
  const recruiterCol = await recruiters();
  const userCol = await usrs();
  let recruiter = await getRecruiter(id);
  if(recruiter) {
    let jobList = await getJobsByRecruiter(id);
    if(jobList.some(e => e.job_id == new ObjectId(jobId))) {
      let applicant = await userCol.updateOne({$and: [{"_id": new ObjectId(applicantId)}, {"jobs.job": new ObjectId(jobId)}]}, {$set: {"jobs.$.status": "Rejected"}})
      if(applicant.modifiedCount === 1) {
        return "Applicant Rejected";
      }else throw new CustomError(500,"Acceptance error");
    } else throw new CustomError(403,"Recruiter does not have this job");
  } else throw new CustomError(400,"Recruiter is not present in the database");
}
  //async function sendMail()
  //async function resetPassword() 



module.exports = {
  createRecruiter,
  getRecruiter,
  getJobsByRecruiter,
  createProfile,
  recruiterCheck,
  updateProfile,
  removeRecruiter,
  postJob,
  updateJob,
  removeJob,
  acceptDecision,
  rejectDecision
}