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