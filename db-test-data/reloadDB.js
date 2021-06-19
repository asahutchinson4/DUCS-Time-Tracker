// File: reloadDB.js
// Author:  Julian Fisher   Date: 1/29/2021
// Copyright 2021 Julian Fisher
// 
// A simple script to empty the DUCS_tra database and fill with default information
// IMPLEMENTATION: Put this file in db-test-data folder. Make sure your webserver and database are 
//running. Open a new terminal window and navigate to the db-test-data folder. Run "node reloadDB.js" 
// in the terminal to reset your database.
// 
// Modification log:

//get models
const SessionTime = require("../models/session-time");
const User = require("../models/user")
const Project = require("../models/project");
const db = require("../models/session-time");

let projects = [
    {
        "projCode": "DTT",
        "name": "DUCS Time Tracker",
        "course": "CSCI 357",
        "semester": "S2021",
        "users": ["dduck@school.edu", "daisyduck@school.edu"],
        "owners": ["mcduck@school.edu"]
    },
    {
        "projCode": "SP1",
        "name": "Simple Project I",
        "course": "CSCI 496",
        "semester": "S2021",
        "users": ["daisyduck@school.edu"],
        "owners": ["mcduck@school.edu"]
    }
]

let users = [
    {
        "lname": "Duck",
        "fname": "Donald",
        "email": "dduck@school.edu",
        "password": "letmein!",
        "role": "student",
        "projects": [{"projCode": "DTT", "name": "DUCS Time Tracker"}]
    },
    {
        "lname": "Duck",
        "fname": "daisy",
        "email": "daisyduck@school.edu",
        "password": "letmein!",
        "role": "student",
        "projects": [{"projCode": "DTT", "name": "DUCS Time Tracker"},{"projCode": "SP1", "name": "Simple Project I"}]
    },
    {
        "lname": "McDuck",
        "fname": "Professor",
        "email": "mcduck@school.edu",
        "password": "letmein!",
        "role": "instructor",
        "projects": [{"projCode": "DTT", "name": "DUCS Time Tracker"},{"projCode": "SP1", "name": "Simple Project I"}]
    },
    {
        "lname": "Doe",
        "fname": "John",
        "email": "jd@school.edu",
        "password": "letmein!",
        "role": "student",
        "projects": []
    }
]

let worksessions = [
    {
        "owner": "dduck@school.edu",
        "project":"DTT",
        "date": new Date("2021-01-05T00:00:00.000Z"),
        "startHr":"18",
        "startMin": "15",
        "finishHr": "20",
        "finishMin": "10",
        "code": "10",
        "code90Desc": "",
        "description": "Defined user stories for the DTT app."
    },
    {
        "owner": "dduck@school.edu",
        "project":"DTT",
        "date": new Date("2021-01-05T00:00:00.000Z"),
        "startHr":"13",
        "startMin": "07",
        "finishHr": "15",
        "finishMin": "07",
        "code": "50",
        "code90Desc": "",
        "description": "Unit Testing."
    },
    {
        "owner": "dduck@school.edu",
        "project":"DTT",
        "date": new Date("2021-01-07T00:00:00.000Z"),
        "startHr":"11",
        "startMin": "00",
        "finishHr": "13",
        "finishMin": "30",
        "code": "30",
        "code90Desc": "",
        "description": "Worked on defining the DTT architecture."
    },
    {
        "owner": "daisyduck@school.edu",
        "project":"DTT",
        "date": new Date("2021-01-03T00:00:00.000Z"),
        "startHr":"17",
        "startMin": "00",
        "finishHr": "18",
        "finishMin": "38",
        "code": "80",
        "code90Desc": "",
        "description": "Started tutorial on React.js."
    },
    {
        "owner": "daisyduck@school.edu",
        "project":"SP1",
        "date": new Date("2021-01-05T00:00:00.000Z"),
        "startHr":"9",
        "startMin": "00",
        "finishHr": "12",
        "finishMin": "15",
        "code": "90",
        "code90Desc": "Travel",
        "description": "Traveled to meeting with customer."
    }
]

Project.deleteMany({}, function(err){
    if(err){
        console.log("Projects failed to delete")
    }
    else{
        console.log("Projects deleted")
    }
}).then(function(){
    //load projects into db
    projects.forEach(function(projectData){
        let currProject = new Project(projectData);
        currProject.save();
        console.log("Project saved")
    })
});


User.deleteMany({}, function(err){
    if(err){
        console.log("Users failed to delete")
    }
    else{
        console.log("Users deleted")
    }
}).then(function(){
    //load users into db
    users.forEach(function(userData){
        let currUser = new User(userData);
        currUser.save();
        console.log("User saved")
    });
});

SessionTime.deleteMany({},function(err){
    if(err){
        console.log("SessionTimes failed to delete")
    }
    else{
        console.log("SessionTimes deleted")
    }
}).then(function(){
    //load work sessions into db
    worksessions.forEach(function(sessionData){
        let currSession = new SessionTime(sessionData);
        currSession.save();
        console.log("SessionTime saved")
    });   
});


