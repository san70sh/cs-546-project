---
title: Functions of Database Operations
date: 11/11/2021
---

# User Functions

## `createProfile`

This function is used to create sub-document `profile` for user collection.

## `create`

Used to create an account for user.

## `updateProfile`

Used to update the `profile` of users

## `update(email, phone, firstname, lastname, password)`

- This function will update **all** the data of the restaurant currently in the database
- All fields need to have valid values.
- If the update succeeds, return the entire restaurant object as it is after it is updated.
