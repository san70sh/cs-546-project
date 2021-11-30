const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");

// const checkWeb = (web) => {
// //depends on the url link
// }

const checkEx = (experience) => {
  if (experience === undefined) {
    //optional user deside whether they want to fill in
    return;
  }
  if (!Array.isArray(experience)) {
    throw "experience must be an array";
  }
  experience.forEach((ele) => {
    if (
      typeof ele.title != "string" ||
      typeof ele.employmentType != "string" ||
      typeof ele.companyName != "string" ||
      typeof ele.startDate != "string" ||
      typeof ele.endDate != "string"
    ) {
      throw "Value of experience in each elements must be string";
    }
    if (
      ele.title.trim().length === 0 ||
      ele.employmentType.trim().length === 0 ||
      ele.companyName.trim().length === 0 ||
      ele.startDate.trim().length === 0 ||
      ele.endDate.trim().length === 0
    ) {
      // not optional, the user must fill in this data when regiester
      throw "Value of experience in each elements can't be empty or just spaces";
    }
    date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!date_regex.test(ele.startDate) && date_regex.test(ele.endDate)) {
      throw "Wrong date formate MM/DD/YYYY";
    }
  });
};

const checkEd = (education) => {
  if (education === undefined) {
    //optional user deside whether they want to fill in
    return;
  }
  if (!Array.isArray(education)) {
    throw "education must be an array";
  }
  education.forEach((ele) => {
    if (
      typeof ele.school != "string" ||
      typeof ele.major != "string" ||
      typeof ele.degree != "string" ||
      typeof ele.startDate != "string" ||
      typeof ele.endDate != "string"
    ) {
      throw "Value of education in each elements must be string";
    }
    if (
      ele.school.trim().length === 0 ||
      ele.major.trim().length === 0 ||
      ele.degree.trim().length === 0 ||
      ele.startDate.trim().length === 0 ||
      ele.endDate.trim().length === 0
    ) {
      // not optional, the user must fill in this data when regiester
      throw "Value of education in each elements can't be empty or just spaces";
    }
    date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!date_regex.test(ele.startDate) && date_regex.test(ele.endDate)) {
      throw "Wrong date formate MM/DD/YYYY";
    }
  });
};

const checkSk = (skills) => {
  if (skills === undefined) {
    //optional user deside whether they want to fill in
    return;
  }
  if (!Array.isArray(skills)) {
    throw "skills must be an array";
  }
  skills.forEach((ele) => {
    if (typeof ele !== "string") {
      throw "skills value must be string";
    }
  });
};

const checkTa = (tags) => {
  if (tags === undefined) {
    //optional user deside whether they want to fill in
    return;
  }
  if (!Array.isArray(tags)) {
    throw "tags must be an array";
  }
  tags.forEach((ele) => {
    if (typeof ele !== "string") {
      throw "tags value must be string";
    }
  });
};

const checkLa = (languages) => {
  if (languages === undefined) {
    //optional user deside whether they want to fill in
    return;
  }
  if (!Array.isArray(languages)) {
    throw "languages must be an array";
  }
  languages.forEach((ele) => {
    if (typeof ele !== "string") {
      throw "languages value must be string";
    }
  });
};

const createProfile = async (
  userId,
  photo,
  gender,
  city,
  state,
  experience,
  education,
  skills,
  languages,
  tags
) => {
  if (
    typeof userId !== "string" ||
    typeof photo !== "string" ||
    typeof gender !== "string" ||
    typeof city !== "string" ||
    typeof state !== "string"
  ) {
    throw "photo, gender, city must be stirng type and can't be null";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (
    photo.trim().length === 0 ||
    gender.trim().length === 0 ||
    city.trim().length === 0 ||
    state.trim().length === 0
  ) {
    // not optional, the user must fill in this data when regiester
    throw "name, location, phoneNumber, website, priceRange can't be empty or just spaces";
  }
  if (gender !== "M" && gender !== "F") {
    throw "gender must be M(male) or F(female)";
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
    tags,
  };
  const insertInfo = await usersCollection.updateOne(
    { _id: userId },
    { $addToSet: { profile: newProfiles } }
  );
  if (insertInfo.modifiedCount === 0) throw "Could not add the profile";
};

const create = async (
  email,
  phone,
  firstname,
  lastname,
  password,
  newProfile
) => {
  if (
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof password !== "string"
  ) {
    throw "user's email, phone. firstname, lastname, password must be string";
  }
  if (
    email.trim().length === 0 ||
    phone.trim().length === 0 ||
    firstname.trim().length === 0 ||
    lastname.trim().length === 0 ||
    password.trim().length === 0
  ) {
    throw "uesr's email, phone. firstname, lastname, password can't be empty or just spaces";
  }
  const phoneCheck = /^([0-9]{3})[-]([0-9]{3})[-]([0-9]{4})$/;
  if (!phoneCheck.test(phone)) {
    throw "Wrong phoneNo formate xxx-xxx-xxxx";
  }
  if (newProfile !== undefined && !Array.isArray(newProfile)) {
    throw "Profile must be array";
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
    favor,
  };
  const insertInfo = await usersCollection.insertOne(newUser);
  if (!insertInfo.acknowledged) throw "Could not add the User";
  if (newProfile !== undefined) {
    newProfile.forEach((ele) => {
      createProfile(
        insertInfo.insertedId,
        ele.userId,
        ele.photo,
        ele.gender,
        ele.city,
        ele.state,
        ele.experience,
        ele.education,
        ele.skills,
        ele.languages,
        ele.tags
      );
    });
  }
};

const updateProfile = async (
  profileId,
  userId,
  photo,
  gender,
  city,
  state,
  experience,
  education,
  skills,
  languages,
  tags
) => {
  if (
    typeof userId !== "string" ||
    typeof photo !== "string" ||
    typeof gender !== "string" ||
    typeof city !== "string" ||
    typeof state !== "string"
  ) {
    throw "photo, gender, city must be stirng type and can't be null";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (!ObjectId.isValid(profileId)) {
    throw "Invalid profileId";
  } else {
    profileId = ObjectId(profileId);
  }
  if (
    photo.trim().length === 0 ||
    gender.trim().length === 0 ||
    city.trim().length === 0 ||
    state.trim().length === 0
  ) {
    // not optional, the user must fill in this data when regiester
    throw "name, location, phoneNumber, website, priceRange can't be empty or just spaces";
  }
  if (gender !== "M" && gender !== "F") {
    throw "gender must be M(male) or F(female)";
  }
  //checkWeb(photo);
  checkEx(experience);
  checkEd(education);
  checkSk(skills);
  checkTa(tags);
  checkLa(languages);
  const usersCollection = await users();
  let newProfiles = {
    _id: profileId,
    photo,
    gender,
    city,
    state,
    experience,
    education,
    skills,
    languages,
    tags,
  };
  const insertInfo = await usersCollection.updateOne(
    { _id: userId, "profile._id": profileId },
    { $set: { "profile.$": newProfiles } }
  );
  if (insertInfo.modifiedCount === 0) throw "Could not update the profile";
};

const update = async (userId, email, phone, firstname, lastname, password) => {
  if (
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof password !== "string"
  ) {
    throw "user's email, phone. firstname, lastname, password must be string";
  }

  if (
    userId.trim().length === 0 ||
    email.trim().length === 0 ||
    phone.trim().length === 0 ||
    firstname.trim().length === 0 ||
    lastname.trim().length === 0 ||
    password.trim().length === 0
  ) {
    throw "uesr's email, phone. firstname, lastname, password can't be empty or just spaces";
  }
  const phoneCheck = /^([0-9]{3})[-]([0-9]{3})[-]([0-9]{4})$/;
  if (!phoneCheck.test(phone)) {
    throw "Wrong phoneNo formate xxx-xxx-xxxx";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  const usersCollection = await users();
  let newUser = {
    email,
    phone,
    firstname,
    lastname,
    password,
  };
  const insertInfo = await usersCollection.updateOne(
    { _id: userId },
    { $set: newUser }
  );
  if (insertInfo.modifiedCount === 0) throw "Could not update the user";
};

const remove = async (userId) => {
  if (!userId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  const usersCollection = await users();
  const deletionInfo = await usersCollection.deleteOne({ _id: userId });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id: ${id}`;
  }
  //**********************remove jobId in is not necessary here
};

const apply = async (jobId, userId) => {
  if (!userId || !jobId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    throw "the jobId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (!ObjectId.isValid(jobId)) {
    throw "Invalid jobId";
  } else {
    jobId = ObjectId(jobId);
  }
  const usersCollection = await users();

  let newjob = {
    _id: jobId,
    status: "pending",
  };
  const insertInfo = await usersCollection.updateOne(
    { _id: userId },
    { $addToSet: { jobs: newjob } }
  );
  if (insertInfo.modifiedCount === 0)
    throw "Could not add the profile, the job is already exists or user doesn't exist";
  //*****************recruiter collection update userId to applicantId.
};

const Favorites = async (jobId, userId) => {
  if (!userId || !jobId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    throw "the jobId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (!ObjectId.isValid(jobId)) {
    throw "Invalid jobId";
  } else {
    jobId = ObjectId(jobId);
  }
  const usersCollection = await users();
  const insertInfo = await usersCollection.updateOne(
    { _id: userId },
    { $addToSet: { favor: jobId } }
  );
  if (insertInfo.modifiedCount === 0)
    throw "Could not add the favor job,  the job is already exists or user doesn't exist";
};

const cancel = async (jobId, userId) => {
  if (!userId || !jobId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    throw "the jobId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (!ObjectId.isValid(jobId)) {
    throw "Invalid jobId";
  } else {
    jobId = ObjectId(jobId);
  }
  const usersCollection = await users();
  const insertInfo = await usersCollection.updateOne(
    { _id: userId },
    { $pull: { jobs: { _id: jobId } } }
  );
  if (insertInfo.modifiedCount === 0)
    throw "Could not add the profile, the job is already exists or user doesn't exist";
};

const track = async (jobId, userId) => {
  if (!userId || !jobId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    throw "the jobId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  if (!ObjectId.isValid(jobId)) {
    throw "Invalid jobId";
  } else {
    jobId = ObjectId(jobId);
  }
  const usersCollection = await users();
  const res = await usersCollection.findOne(
    { _id: userId, "jobs._id": jobId },
    { jobs: { $elemMatch: { _id: jobId } } }
  );
  if (res === null) throw "user or job did not exists";
  let tmp;
  res.jobs.filter((ele) => {
    if (ele._id.equals(jobId)) {
      tmp = ele.status;
    }
  });
  return tmp;
};

const trackAll = async (userId) => {
  if (!userId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string") {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  const usersCollection = await users();
  const res = await usersCollection.findOne({ _id: userId });
  if (res === null) throw "user did not exists";
  return res.jobs;
};

const get = async (userId) => {
  if (!userId) {
    throw "id must be provided";
  }
  if (typeof userId !== "string") {
    throw "the userId must be non-empty string and can't just be space";
  }
  if (!ObjectId.isValid(userId)) {
    throw "Invalid userID";
  } else {
    userId = ObjectId(userId);
  }
  const usersCollection = await users();
  const res = await usersCollection.findOne({ _id: userId });
  if (res === null) throw "user did not exists";
  return res;
};
const getAll = async () => {
  const usersCollection = await users();
  const res = await usersCollection.find({}).toArray();
  return res;
};

// test functions **IMPORTANT**
//checkEx([{title:"Maintenance Engineer", employmentType: "full time", companyName:"Apple",startDate: "08/05/2017", endDate: "08/05/2018"}])
//checkEd([{school:"SIT", major: "CE", degree:"master of science",startDate: "08/05/2017", endDate: "08/05/2018"}])
//console.log(ObjectId.isValid('timtomtamted'));

// createProfile(
//     "61a33e54ded974aae50bb725",
//     "one url",
//     "M",
//     "Hoboken",
//     "NJ",
//     [{title:"Maintenance Engineer", employmentType: "full time", companyName:"Apple",startDate: "08/05/2017", endDate: "08/05/2018"}],
//     [{school:"SIT", major: "CE", degree:"master of science",startDate: "08/05/2017", endDate: "08/05/2018"}],
//     ["Java", "JS"],
//     ["english"],
//     ["SDE","DS"]
// ).catch(e => log(e));
//tmp =

// create("James@gmail.com", "848-242-6666", "Liam", "James", "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O", undefined)

// updateProfile(
//     '61a34056fbd0613af9d399fc',
//     "61a33e54ded974aae50bb725",
//     "one url",
//     "M",
//     "Hoboken",
//     "NJ",
//     [{title:"Maintenance Engineer", employmentType: "full time", companyName:"Apple",startDate: "08/05/2017", endDate: "08/05/2018"}],
//     [{school:"SIT", major: "CE", degree:"master of science",startDate: "08/05/2017", endDate: "08/05/2018"}],
//     ["Java", "JS"],
//     ["english","ch"],
//     ["SDE","DS","Web"]
// )

//update("61a33e13067da688cb1f8e39","Wangyou@gmail.com", "848-242-6666", "you", "wang", "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O").catch(ele => console.log(ele));
//apply("61a33e454966f774489ca999","61a4236167e3b3f821f5e374").catch(ele => console.log(ele));
//cancel("61a33e454966f774489ca999", "61a4236167e3b3f821f5e374");

//track("61a33e454966f774489ca999", "61a4236167e3b3f821f5e374").then(ele => console.log(ele));
//trackAll("61a4236167e3b3f821f5e374").then(ele => console.log(ele));
//get("61a4236167e3b3f821f5e374").then(ele => console.log(ele));
//getAll().then(ele => console.log(ele));
