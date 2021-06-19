// File: user.js
// Author: S. Sigman    Date: 11/17/2020
// Copyright 2021 by S. Sigman
//
// This file defines the schema for user objects 
// in the app's database.  Legal alues for the role 
// property are:
//   * student
//   * instructor
//
// Modifications
// 1/17/2021 Reused code from App Dev I 2020 project. S. Sigman
// 1/20/2021 Added array of projects objects. Each object should
//           have the project code (not objectID) and project name.
var db = require("../db");

var User = db.model("User", {
    lname: String,   // last name
    fname: String,   // first name
    email: {type: String, required: true},  // will need to set a minimum length
    password: {type: String, required: true},
    role: {type: String, required:true, default: 'student'},
    projects: []
});

module.exports = User;