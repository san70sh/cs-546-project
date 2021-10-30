# DB Proposal

## Github Repository

[github.com/ywang408/cs-546-project](https://github.com/ywang408/cs-546-project)

## Group members

Chen, Yuyun

Joshi, Ashwin

Wang, You

Vinnakota, Bapiraju

## Users

The user collection will contain all users registered with the portal, along with mandatory required Information:

- email id
- phone
- name
- Password(encrypted)

And optional features: 

- A profile picture(store on Google Cloud Platform or other storage platform)
- A list of jobs(one-to-many relationships with collection Job that users have saved and applied to)
- The status of their application with some default value(passed/rejected/pending).
- Other optional user information(gender, address, favor job, tags)

A user can update their profile by logging in to the portal.

```js
  "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  "Password":"$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
  "FirstName": "Liam",
  "LastName”: "James",
  "Email": "James@gmail.com",
  "Phone": "848-242-6666",
  "Gender": "M",
  "City": "Hoboken",
  "State": "NJ",
  “Jobs”: [{"Job": "job1._id" , "statues": "pending"},{"Job": "job2._id" , "statues": "rejected"}],
  "Profile": "image/pdf url",
  "Favor": ["job3._id","job4._id","job5._id"],
  "Tags": ["SDE", "frontend"]`
```

|   Name   |  Type  |                         Description                          |
| :------: | :----: | :----------------------------------------------------------: |
|   _id    | String |     A globally unique identifier to represent the user.      |
| Password | String |        Encrypted password use for login verification         |
|   Jobs   | Array  |               A list of jobs that user applied               |
| Profile  | String | A URL point to the image/PDF style resumes stores for each user |
|  Favor   | Array  |                     User's favorite job                      |
|   Tags   | Array  |              Types of work users tend to choose              |
