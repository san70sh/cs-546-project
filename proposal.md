# Proposal

## Github repo

https://github.com/ywang408/cs-546-project

## Group members

Chen, Yuyun \
Joshi, Ashwin \
Wang, You \
Vinnakota, Bapiraju

## Introduction of the project

## Core features

- Main Page
  - The main page will contain a list of posted jobs; Users can sort and filter the jobs by Job Posted Date, Job Expiry date, Job Location.
  - There will be a search bar, where users can search for jobs based on companies, location and skills.
  - There will be a Login/Register button on the top right corner of the page.
  - On logging in, the job seekers will be shown jobs related to them.

- User Profile
  - Sign up and in as recruiters or job seekers.

    - For job seekers: 
      - During registration, apart from requesting basic information, they can upload their resume as an option. Using their resume, we extract their details to store in our database, and fill the requested fields.
      - We have an general resume template for job seekers. If there isn't sufficient information in their resume, we will ask them to fill them, in case the field is mandatory. Also, job seekers can fill the fields manually if they do not want to upload a resume.
      - They will be able to upload new resumes later in case of any update.
      - They will be able to track the status of their applied jobs.
      - They will be able to save jobs in case they would want to apply later.

    - For recruiters:
      - Recruiters will be required to fill a different set of fields such as Company and position.
      - They will be able to see jobs they had posted.

- Job Pages
  - The overall job list page is the primary page, and every job has its own page.

    - Recruiters
      - They can post new jobs as well as update/delete their job pages.
      - They are able to accept or reject applications inside their job pages.

    - Job seekers
      - They can access the job page where additional information will be displayed and can apply from that page.

## Extra features

- Use cookies to refresh the status of logging.
