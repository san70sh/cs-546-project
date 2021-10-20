# Proposal

## Github repo

https://github.com/ywang408/cs-546-project

## Group members

Chen, Yuyun
Joshi, Ashwin
Wang, You
Vinnakota, Bapiraju

## Introduction of the project

## Core features

- Main Page
  - The main page will contain a list of posted jobs; Users can sort, filter the jobs by some fields, for example, created date, update date, job location and etc.
  - Search bar, users can search with regard to companies, job location and etc.
  - Login button on the top right.
  - When users log in, our application will filter the job list and only show related jobs to the users.

- User Profile
  - Sign up and in as recruiters or job seekers.
    - For job seekers: 
      - During registration, apart from offering basic information, they can upload their resume as an option. Once we have their resume, we extract their infos to store in our database, and finish their profiles.
      - We have an general resume template for job seekers. If there isn't sufficient information in their resume, we will fill them with blank first and ask them to fill them later. Also, job seekers can fill our template directly if they don't want to upload a resume.
      - They will be able to update their resume since there may exist errors when we parsing their pdf into our template.
      - Track the status of their applied jobs.
      - A favorite list to save some jobs.
    - For recruiters:
      - Recruiters also need to submit their information but it's different from job seekers.
      - Able to see their posted job list.

- Job Pages
  - The overall job list page is the main page, and each job has one individual job page,
  - Recruiters
    - They can post and update the information in individual job pages.
    - They are able to accept or reject applications in individual job pages.
  - Job seekers
    - In individual job pages, they can know the information of jobs and select to apply for them.

## Extra features

- Use cookies to refresh the status of logging.
- Using LinkedIn api
