# DB Proposal

## Github Repository

[github.com/ywang408/cs-546-project](https://github.com/ywang408/cs-546-project)

## Group members

Chen, Yuyun

Joshi, Ashwin

Wang, You

Vinnakota, Bapiraju

## Users

The user collection will contain all users registered with the portal, along with the following information.

mandatory required Information:

- email id
- phone
- name
- Password(encrypted)

And optional features, these features must be fulfilled when they try to apply for jobs. It would be stored as a sub-document under `profile`.

- ID photo(store on Google Cloud Platform or other storage platform)
- Working Experience(Each experience is followed by one company and corresponding description)
- Education(Each education is followed by one school and corresponding description)
- Skills
- Languages
- Tags(Users' interested fields of jobs)

Here's one example of sub-document `profile`:

```
"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
"photo": one url
"experience":
"education":
"skills":
"languages":
"tags:"
```

We will initialize the following fields to be empty, and these fields will be added later.

- jobs(Users' applied jobs and status)
- favor(Users' interested jobs and they can save them in it for applying later)

Here's one example of whole data for one user:

```
  "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  "Password": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
  "FirstName": "Liam",
  "LastName”: "James",
  "Email": "James@gmail.com",
  "Phone": "848-242-6666",
  "Gender": "M",
  "City": "Hoboken",
  "State": "NJ",
  “Jobs”: [{"Job": "job1._id", "statues": "pending"},{"Job": "job2._id", "statues": "rejected"}],
  "Profile": "image/pdf url",
  "Favor": ["job3._id","job4._id","job5._id"],`
  "Tags": ["SDE", "frontend"]`
```

|   Name   |  Type  |                           Description                           |
|:--------:|:------:|:---------------------------------------------------------------:|
|   _id    | String |       A globally unique identifier to represent the user.       |
| Password | String |          Encrypted password use for login verification          |
|   Jobs   | Array  |                A list of jobs that user applied                 |
| Profile  | String | A URL point to the image/PDF style resumes stores for each user |
|  Favor   | Array  |                       User's favorite job                       |
|   Tags   | Array  |               Types of work users tend to choose                |

## Recruiters

The recruiters collection will contain information of the recruiter who have registered with the portal, both mandatory and optional:


- firstName
- lastName
- email id
- phone
- Password(encrypted)
- position
- company

And optional features:

- A profile picture(store on Google Cloud Platfrom or other storage platform)
- A list of jobs posted by the recruiter with applicant details, if present
- Other optional recruiter information(about, gender, address, tags)

A recruiter can update their profile by logging in to the portal.

```
  `"_id": "7b7997a2-c0d2-4f8c-b27a-6h87fhsk4j87",
  "Password": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
  "FirstName": "Adam",
  "LastName”: "Stone",
  "Email": "astone@abc.com",
  "Phone": "747-299-7453",
  "Gender": "M",
  "City": "Hoboken",
  "State": "NJ",
  "Position":"Senior Recruiter",
  "Company": "ABC Inc.",
  "About": "I have been working as a strategic recruiter at ABC Inc. for the past 5 years where I have successfully recruited talent for various company specific roles. At ABC Inc., we always welcome fresh talent, so if you believe you're one of them, give me a ping."
  “Jobs”: [{"Job": "job1._id", "applicants": [{"applicantId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310", "firstName": "George", "lastName": "West", "Email": "James@gmail.com", "Phone": "848-242-6666", "resume": "pdf url"}]},
  "Profile": "image url"`
```

|     Name      |  Type  |                         Description                          |
|   :------:    | :----: | :----------------------------------------------------------: |
|      _id      | String |     A globally unique identifier to represent the user.      |
|    Password   | String |        Encrypted password use for login verification         |
|   FirstName   | String |                First name of the recruiter                   |
|    LastName   | String |                 Last name of the recruiter                   |
|     Email     | String |                  Email of the recruiter                      |
|  Phone Number | String |                 Last name of the recruiter                   |
|    Profile    | String |          A URL point to the image of the recruiter           |
|    Position   | String |              Title/Position of the recruiter                 |
|     About     | String |              Brief Description of the recruiter              |
|    Company    | String |                    Company of the recruiter                  |
|     Jobs      | Array  |        A list of jobs that the recruiter has posted          |

The Jobs array contains sub documents with the details of the applicants applied for this job.


|      Name      |     Type     |                    Description                     |
|:--------------:|:------------:|:--------------------------------------------------:|
|   applicantID  |    String    |                 Id of the applicant                |
|      Name      |    String    |                 Name of the applicant              |
|  Phone Number  |    String    |             Phone number of the applicant          |
|     Email      |    String    |             Email address of the applicant         |
|     Resume     |    String    |     A URL point to the resume of the applicant     |

## JOBS

The jobs collection will contain all the Jobs info provided by recruiter. This collection will only store the active Jobs.

- title
- type of job
- employer company
- contact email/website
- location
- Posted by
- Post date
- application deadline
- job details (Object about company, role details, skills, benefits)

And optional features:

- pay range
- company profile pic

Recruiters can update the jobs

```
"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
"title":"Software development summer 2022 internship"
"type": "internship",
"company: "Stevens",
"Recruiter_name": "get it from recruiter id from recruiter collection",
"contact": "stevens.edu",
"location_city": "Hoboken",
"location_State": "NJ",
“PostedOn”: "today's date in MM/DD/YYYY,
"Deadline":"MM/DD/YYY"
"JobDetails": {
  "summary":"This is a abc company",
  "Role_Description":"This a devops role your responsibilities will be abc",
  "required_Skills":["Java","Mongodb"],
  "Benefits":"you will get travelling allowance,insurance etc."
},
  "payment range":" 50 - 100 $ PER HOUR"
  "company_pic": "image/pdf url"
```

|      Name      |     Type     |                    Description                     |
|:--------------:|:------------:|:--------------------------------------------------:|
|      _id       |    String    | A globally unique identifier to represent the job. |
|     title      |    String    |                  Title of the job                  |
|      type      |    string    |       Internship/Full time/ part time/ Coop        |
|    company     |    String    |            Name of the employer company            |
| Recruiter_name |    String    | Name from recruiters collection using recruiter id |
|    contact     |    String    |                  website/email id                  |
| location_city  |    String    |               Name of the work city                |
| location_state |    String    |               Name of the work state               |
|    PosteOn     | Date(Object) |              current date of the post              |
|    Deadline    | Date(Object) |             Date in MM/DD/YYYY format              |
|   JobDetails   |    Object    |    includes summary, responsibilities, benefits    |
| payment range  |    String    |                 "$20/25 per hour"                  |
|  profile pic   |    String    |           "an url to display pictures "            |



This the Job Details sub document all the fields in this object are optional


|      Name      |     Type     |                    Description                     |
|:--------------:|:------------:|:--------------------------------------------------:|
|    summary     |    String    |      This the description about the company        |
|Role_Description|    String    |                  Job responsibilities              |
|    Skills      |    Array     |                  ["Java","Mongodb"]                |
|    Benefits    |    String    |                  Benifits of the Job               |
| Recruiter_name |    String    | Name from recruiters collection using recruiter id |
