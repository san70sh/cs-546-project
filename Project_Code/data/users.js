const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

// const checkWeb = (web) => {
// //depends on the url link
// }

const checkEx = (experience) => {
    if (experience === undefined) {//optional user deside whether they want to fill in
        return;
    }
    if (!Array.isArray(experience)) {
        throw 'experience must be an array';
    }
    experience.forEach(ele => {
        if (typeof ele.title != 'string' || typeof ele.employmentType != 'string' || typeof ele.companyName != 'string' || typeof ele.startDate != 'string' || typeof ele.endDate != 'string') {
            throw 'Value of experience in each elements must be string'
        }
        if (ele.title.trim().length === 0 || ele.employmentType.trim().length === 0 || ele.companyName.trim().length === 0 || ele.startDate.trim().length === 0 || ele.endDate.trim().length === 0) { // not optional, the user must fill in this data when regiester
            throw 'Value of experience in each elements can\'t be empty or just spaces'
        }
        date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (! date_regex.test(ele.startDate) && date_regex.test(ele.endDate)) {
            throw 'Wrong date formate MM/DD/YYYY';
        }
    });
}

const checkEd = education => {
    if (education === undefined) {//optional user deside whether they want to fill in
        return;
    }
    if (!Array.isArray(education)) {
        throw 'education must be an array';
    }
    education.forEach(ele => {
        if (typeof ele.school != 'string' || typeof ele.major != 'string' || typeof ele.degree != 'string' || typeof ele.startDate != 'string' || typeof ele.endDate != 'string') {
            throw 'Value of education in each elements must be string'
        }
        if (ele.school.trim().length === 0 || ele.major.trim().length === 0 || ele.degree.trim().length === 0 || ele.startDate.trim().length === 0 || ele.endDate.trim().length === 0) { // not optional, the user must fill in this data when regiester
            throw 'Value of education in each elements can\'t be empty or just spaces'
        }
        date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (! date_regex.test(ele.startDate) && date_regex.test(ele.endDate)) {
            throw 'Wrong date formate MM/DD/YYYY';
        }
    });
}

const checkSk = skills => {
    if (skills === undefined) {//optional user deside whether they want to fill in
        return;
    }
    if (!Array.isArray(skills)) {
        throw 'skills must be an array';
    }
    skills.forEach(ele => {
        if (typeof ele !== 'string') {
            throw "skills value must be string";
        }
    });
}
const checkTa = tags => {
    if (tags === undefined) {//optional user deside whether they want to fill in
        return;
    }
    if (!Array.isArray(tags)) {
        throw 'tags must be an array';
    }
    tags.forEach(ele => {
        if (typeof ele !== 'string') {
            throw "tags value must be string";
        }
    });
}


const checkLa = languages => {
    if (languages === undefined) {//optional user deside whether they want to fill in
        return;
    }
    if (!Array.isArray(languages)) {
        throw 'languages must be an array';
    }
    languages.forEach(ele => {
        if (typeof ele !== 'string') {
            throw "languages value must be string";
        }
    });
}

const createProfile = async(userId, photo, gender, city, state, experience, education, skills, languages, tags) => {
    if (typeof userId !== 'string' || typeof photo !== 'string' || typeof gender !== 'string'|| typeof city !== 'string' || typeof state !== 'string') {
        throw 'photo, gender, city must be stirng type and can\'t be null';
    }
    if (!ObjectId.isValid(userId)) {
        throw 'Invalid userID'
    } else {
        userId = ObjectId(userId); 
    }
    if (photo.trim().length === 0 || gender.trim().length === 0 || city.trim().length === 0 || state.trim().length === 0) { // not optional, the user must fill in this data when regiester
        throw 'name, location, phoneNumber, website, priceRange can\'t be empty or just spaces'
    }
    if (gender !== 'M' && gender !== 'F') {
        throw 'gender must be M(male) or F(female)';
    }
    //checkWeb(photo);
    checkEx(experience);
    checkEd(education);
    checkSk(skills);
    checkTa(tags);
    checkLa(languages);
    const usersCollection = await users();
    let _id = ObjectId();
    let newProfiles = {
        _id,
        photo,
        gender,
        city,
        state,
        experience,
        education,
        skills,
        languages,
        tags
    };
    const insertInfo = await usersCollection.updateOne(
        { _id: userId },
        { $addToSet: { profile: newProfiles } }
    );
    if (insertInfo.modifiedCount === 0) throw 'Could not add the profile';
}

const create = async(email, phone, firstname, lastname, password, newProfile) => {
    if (typeof email !== 'string' || typeof phone !== 'string' || typeof firstname !== 'string' || typeof lastname !== 'string' || typeof password !== 'string') {
        throw 'user\'s email, phone. firstname, lastname, password must be string';
    }
    if (email.trim().length === 0 || phone.trim().length === 0 ||firstname.trim().length === 0 ||lastname.trim().length === 0 ||password.trim().length === 0) {
        throw 'uesr\'s email, phone. firstname, lastname, password can\'t be empty or just spaces';
    }
    const phoneCheck = /^([0-9]{3})[-]([0-9]{3})[-]([0-9]{4})$/;
    if (! phoneCheck.test(phone)) {
        throw 'Wrong phoneNo formate xxx-xxx-xxxx';
    }
    if (newProfile !== undefined && !Array.isArray(newProfile)) {
        throw 'Profile must be array';
    }
    const jobs = [];
    const profile = [];
    const favor = [];
    const usersCollection = await users();
    let newUser = {
        email,
        phone,
        firstname,
        lastname,
        password,
        jobs,
        profile,
        favor
    }
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged) throw 'Could not add the User';
    if (newProfile !== undefined) {
        newProfile.forEach(ele => {
            createProfile(insertInfo.insertedId, ele.userId, ele.photo, ele.gender, ele.city, ele.state, ele.experience, ele.education, ele.skills, ele.languages, ele.tags);
        });
    }
}

const updateProfile = async(profileId, userId, photo, gender, city, state, experience, education, skills, languages, tags) => {
    if (typeof userId !== 'string' || typeof photo !== 'string' || typeof gender !== 'string'|| typeof city !== 'string' || typeof state !== 'string') {
        throw 'photo, gender, city must be stirng type and can\'t be null';
    }
    if (!ObjectId.isValid(userId)) {
        throw 'Invalid userID'
    } else {
        userId = ObjectId(userId); 
    }
    if (!ObjectId.isValid(profileId)) {
        throw 'Invalid profileId'
    } else {
        profileId = ObjectId(profileId); 
    }
    if (photo.trim().length === 0 || gender.trim().length === 0 || city.trim().length === 0 || state.trim().length === 0) { // not optional, the user must fill in this data when regiester
        throw 'name, location, phoneNumber, website, priceRange can\'t be empty or just spaces'
    }
    if (gender !== 'M' && gender !== 'F') {
        throw 'gender must be M(male) or F(female)';
    }
    //checkWeb(photo);
    checkEx(experience);
    checkEd(education);
    checkSk(skills);
    checkTa(tags);
    checkLa(languages);
    const usersCollection = await users();
    let newProfiles = {
        _id:profileId,
        photo,
        gender,
        city,
        state,
        experience,
        education,
        skills,
        languages,
        tags
    };
    const insertInfo = await usersCollection.updateOne(
        { _id: userId, "profile._id": profileId},
        { $set: { "profile.$": newProfiles } }
    );
    if (insertInfo.modifiedCount === 0) throw 'Could not update the profile';
}

const update = async(userId, email, phone, firstname, lastname, password) => {
    if (typeof userId !== 'string'||typeof email !== 'string' || typeof phone !== 'string' || typeof firstname !== 'string' || typeof lastname !== 'string' || typeof password !== 'string') {
        throw 'user\'s email, phone. firstname, lastname, password must be string';
    }
    
    if (userId.trim().length === 0 || email.trim().length === 0 || phone.trim().length === 0 ||firstname.trim().length === 0 ||lastname.trim().length === 0 ||password.trim().length === 0) {
        throw 'uesr\'s email, phone. firstname, lastname, password can\'t be empty or just spaces';
    }
    const phoneCheck = /^([0-9]{3})[-]([0-9]{3})[-]([0-9]{4})$/;
    if (! phoneCheck.test(phone)) {
        throw 'Wrong phoneNo formate xxx-xxx-xxxx';
    }
    if (!ObjectId.isValid(userId)) {
        throw 'Invalid userID'
    } else {
        userId = ObjectId(userId); 
    }
    const usersCollection = await users();
    let newUser = {
        email,
        phone,
        firstname,
        lastname,
        password
    }
    const insertInfo = await usersCollection.updateOne(
        { _id: userId},
        {$set : newUser}
    );
    if (insertInfo.modifiedCount === 0) throw 'Could not update the user';
}