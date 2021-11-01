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

" BAPI your features here "

## JOBS

The jobs collection will contain all the Jobs info provided by recruiter. This collection will only store the active Jobs.

The jobs collection will contain all users registered with the portal, along with: mandatory required Information:

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
“PostedOn”: "today's date in MM/DD/YYY,
"Deadline":"MM/DD/YYY"
"JobDetails": {
  "summary":"This is a abc company",
  "Role_Discription":"This a devops role your responsibilities will be abc",
  "rquired_Skills":["Java","Mongodb"],
  "Benifits":"you will get travelling allowance,insurrance etc."
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
| Recruiter_name |    String    | Name from recruiters collection using recruited id |
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
|    summary     |    String    |      This the discription about the company        |
|Role_Discription|    String    |                  Job responsibiltites              |
|    Skills      |    Array     |                  ["Java","Mongodb"]                |
|    Benifits    |    String    |                  Benifits of the Job               |
| Recruiter_name |    String    | Name from recruiters collection using recruited id |
