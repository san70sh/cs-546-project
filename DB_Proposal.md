# DB Proposal

## Github Repository

[github.com/ywang408/cs-546-project](https://github.com/ywang408/cs-546-project)

## Group members

Chen, Yuyun

Joshi, Ashwin

Wang, You

Vinnakota, Bapiraju

## Users

The user collection will contain all users registered with the portal, along with: mandatory required Information:

// please add location/address to the fields here

- email id
- phone
- name
- Password(encrypted)

And optional features:

// please add features as we see on handshake like work exp education then achievements if any etc.
// Again please refer handshake ans see what they are asking us to fill while creating an account
// Make some fields to stored saved jobs as well.
// All of these will come in optional features

- A profile picture(store on Google Clould Platfrom or other storage platform)
- A list of jobs(one-to-many relationships with collection Job that users have saved and applied to)
- The status of their application with some default value(passed/rejected/pending)
- Other optional user information(gender, address, favor job, tags)

A user can update their profile by logging in to the portal.

```json
  `"_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
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
  `"Tags": ["SDE", "frontend"]`
```

|   Name   |  Type  |                         Description                          |
| :------: | :----: | :----------------------------------------------------------: |
|   _id    | String |     A globally unique identifier to represent the user.      |
| Password | String |        Encrypted password use for login verification         |
|   Jobs   | Array  |               A list of jobs that user applied               |
| Profile  | String | A URL point to the image/PDF style resumes stores for each user |
|  Favor   | Array  |                     User's favorite job                      |
|   Tags   | Array  |              Types of work users tend to choose              |

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
- job details (including about company, role details, benefits)

And optional features:

- required skill set
- pay range
- company profile pic

Recruiters can update the jobs 

```json
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
"JobDetails": "The Development Manager oversees day-to-day technical operations across projects and supports th development team in their personal growth, project successes, and job satisfaction. This role provides steering and guidance to the Development team members on their various projects and general workload and intercedes as necessary. They serve as both a mentor and an advocate and help build cross-departmental collaboration with the rest of the agency. 


  Reports to: Director of Technology

  Essential Functions & Responsibilities

  Oversees day-to-day operations for the development team

  Requirements

  8+ years of development experience
  Experience managing teams of people",
  "required_skills":["JAVASCRIPT","MONGODB","NODEJS"],
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
|   JobDetails   |    String    |    includes summary, responsibilities, benefits    |
| RequiredSkills |    Array     |         ["JAVASCRIPT","MONGODB","NODEJS"]          |
| payment range  |    String    |                 "$20/25 per hour"                  |
|  profile pic   |    String    |           "an url to display pictures "            |
