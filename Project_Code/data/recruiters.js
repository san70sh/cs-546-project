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


const mongoCollections = require('../config/mongoCollections');
const recruiters = mongoCollections.recruiters;
const bcrypt = require('bcrypt');
const saltRounds = 16;

function CustomError (status, message) {
  this.status = status;
  this.message = message;
}

async function createRecruiter(email, password, firstname, lastName, phone) {
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
  firstname = firstname.trim();
  lastName = lastName.trim();
  if(firstname == "" || firstname == undefined) throw new CustomError(400,"Please enter your first name.");
  if(!re3.test(firstname)) throw new CustomError(400,"Your name should not contain special characters.");
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
          firstName: firstname,
          lastName: lastName,
          phone: phone 
      }

      const insertInfo = await recruiterCol.insertOne(newRec);
      if (insertInfo.insertedCount === 0) {
          throw new CustomError(500,'Internal Server Error');
      } else {
          let returnObj = {"userInserted": true};
          return returnObj;
      }
  } else {
      throw new CustomError(400,`Username with ${email} already exists in the database.`);
  }
}

async function getRecruiter(email) {

  //Email validation
  let re = /[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}/im
  if(email == "" || email == undefined) throw new CustomError(400,"Please enter your email.");
  if(email.length < 6) throw new CustomError(400,"The email is too short.");
  if(!re.test(email)) throw new CustomError(400,`${email} is not a valid email.`);
  email = email.toLowerCase();

  const recruiterCol = await recruiters();
  let recruiter = await recruiterCol.findOne({"email": email});
      if (recruiter) {
          return recruiter;
      } else {
        let returnObj = {"recFound": false}
          return returnObj;
      }
}

async function createProfile(email, gender, photo, city, state, company, about) {
  const recruiterCol = await recruiters();
  let recruiter = await getRecruiter(email);

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
    let newProfile = {
      gender: gender,
      city: city,
      state: state,
      about: about,
      company: company,
      photo: photo
    }
    const recruiterUpdate = await recruiterCol.updateOne({ _id: recruiter._id }, { $push: { profile: newProfile } });
    if (recruiterUpdate.modifiedCount === 0) {
      throw `The recruiter's profile could not be updated.`;
    } else {
        return "Sucessfully updated";
    }
  } else {
    throw `Recruiter with the email ${email} does not exist in the database.`;
  }
}


module.exports = {
  createRecruiter,
  getRecruiter,
  createProfile
}