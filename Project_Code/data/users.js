/* Hi all these are the specs for the db connection.

dbname : 'JobHunt_db'

NOTE : please add your variables and specs while implementing here 

PLEASE MAKE SURE YOU ADD THE VARIABLE SPECS HERE AND USE CONSISTENT VARIABLE NAMING IN YOU CODE !!!!!!!!!!!!!!!
PLEASE ADD YOUR NAMES WITH THE VARIABLES AS 

FOR EX.
1) ASHWIN : 
   
   VARIABLENAMEs : users, recruiters, jobs 
   TYPE    : MONGO collection
   FUNCTION : to redirect it to respective data pages 


2) BAPI:

    Bapi add your variable here you don't need to follow the foramat above.


3) YOU:





4) ANDY:





# THIS WILL HELP EVERYBODY FOR DEBUGGING.






AS of now I can think of only four collections

1) USERS
2) RECRUITERS
3) JOBS
4) USERNAME AND PASSWORD STORE WITH RESPECT TO USERS AND RECRUITES :- Key store 

Please refer to the You's spec sheet

#################################################################################

PLEASE MAKE SURE YOU ADD A FUNCTION TO ADD JOB TO SAVED AND APPLIED LIST AS WELL 

title	date
Functions of Database Operations
11/11/2021

User Functions
createProfile(userId, photo, gender, city, state, experience, education, skills, languages, tags)
This function is used to create sub-document profile for the user with userId, All fields need to match the type specified in DB_proposal. It will return newly created profile.

The following is one example:

"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
"photo": "one url",
"gender": "m",
"city": "Hoboken",
"state": "NJ",
"experience":[{"title":"Maintenance Engineer", "employment type": "full time", 
"Company name":"Apple","start date": "08/05/2017", "end date": "08/05/2018"}]
"education":[
{"school":"xxx university", "field of study":"computer science", 
"degree":"master of science", 
"start date": "08/05/2010", "end date": "08/05/2014"}]
"skills":["Java", "JS"]
"languages":["english"]
"tags":["SDE","DS"]
create(email, phone, firstname, lastname, password, profile)
Used to create an account for user:

all the fields must be valid except for profile.
For profile, if it's a pdf, we will use functions in package to parse it, and then use createProfile to create a profile. If profile is empty, set it with an empty object.
jobs and favour will be initialized with empty arrays.
password must be encoded and then be saved to database. (encode and decode function to be determined later)
will return newly created user info.
One example:

"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
"email": "James@gmail.com",
"phone": "848-242-6666",
"firstName": "Liam",
"lastName": "James",
"password": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
"jobs”: [],
"profile": ["profile1"]
"favor": []


updateProfile(profileId, userId, photo, gender, city, state, experience, education, skills, languages, tags)
Used to update the sub-document profile of users with profileId. The logic should be the same with function createProfile.

update(id, email, phone, firstname, lastname, password)
This function will update all the mandatory required data of this user currently in the database
All fields need to have valid values.
If the update succeeds, return the entire user object as it is after it is updated.

remove(id)
If the removal succeeds, return the name of the user and the text " has been successfully deleted!"
Also update the job under recruiter collection with this jobId: remove the userId from applicantId.


apply(jobId)
Add this jobId to user's jobs field, and its status should be pending.
Cannot apply jobs that already be applied.
Also update the job under recruiter collection with this jobId: add the userId to applicantId.
save
Add this jobId to user's favour field.
Cannot save jobs that already be saved.

cancel(jobId)(which used to cancel application for a job)
remove this jobId from user's jobs field
Also update the job under recruiter collection with this jobId: remove the userId from applicantId.

track(jobId)
Return the status of this jobId.

trackAll()
Return all of jobs along with their status.

get(id)
When given an id, this function will return a user from the database.

getAll()
Return all of the users from the database.


loginCheck(username, password)

all the fields must be valid except for profile.
if profile is empty, set it with empty object.
For profile, it should be an object(all fields must be valid) and we use createProfile to help us create the recruiter's profile.
jobs will be initialized with empty arrays.
password must be encoded and then be saved to database. (encode and decode function to be determined later)
will return newly created recruiter info.
update and updateProfile will have the same logic with previous functions





*/

///          ###################### Code starts here ###########################

// All the imports should be here

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
var ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// createUser mandatory function for apply 

// write check function for the createUser 

async function createUser(email, phone, firstName, lastName, password){

    /* Schema to be followed :

    ##################### Note : favor attribute has changed to "saved"      #######################

    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "email": "James@gmail.com",
    "phone": "848-242-6666",
    "firstName": "Liam",
    "lastName": "James",
    "password": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    "jobs”: [],
    "profile": ["profile1","profile2"]
    "saved": []

    */

    // ######## call the error check function here ###########






    const usersCollection = await users();

    // check function to find the email already in the database 
    
    // variable "hash used to store in the database"
    const hash = await bcrypt.hash(password, saltRounds);

    // "user" variable for creating an object to insert it into db 
    let user = {
        email: email,
        phone: phone,
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        password: hash,
        jobs: [],
        profile: [],
        reviews: []
    };

    const insertInfo = await usersCollection.insertOne(user);
    //console.log(insertInfo);
    if (insertInfo.insertedCount === 0) throw 'Could not add restaurant';
    
    const newId = insertInfo.insertedId.toString();
 

    let res = await this.get(newId);
     
    res._id = res._id.toString();

  
    return res;
}


async function checkUser ( email, password ){
    // write a check function for valid email and password 


    email = email.trim().toLowerCase();
    password = password.trim();

    const usersCollection = await users();

    const res = await usersCollection.findOne( {email : email} );

    if(!res){
        throw `User not found in the users db`;
    }

    let comp = await bcrypt.compare(password, res.password);

    if(comp){
        //console.log("here1");
        return {authenticated: true};
    }else{

        throw ` Password is invalid `;
        
    }



}



