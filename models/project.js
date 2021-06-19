// File: user.js
// Author: S. Sigman    Date: 11/17/2020
// Copyright 2021 by Scott Sigman
//
// This file defines the schema for project objects 
// in the app's database.
//
// Modifications
// 1/20/2021 Adapted from App Dev I project from Fall 2020.
//           S. Sigman
// 1/20/2021 Added users array.  Contains emails of all students
//           on the project team. S. Sigman
// 1/20/2021 Added owners array.  Contains the emails of all the
//           instructors who own this project.

var db = require("../db");

var Project = db.model("Project", {
    projCode: {type: String, required: true},
    name: {type: String, required: true},
    course: {type: String, required: true},
    semester: {type: String, required: true},
    users: [String],
    owners: {type: [String], required: true}
});

module.exports = Project;