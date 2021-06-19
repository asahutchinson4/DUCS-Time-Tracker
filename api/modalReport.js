// File modalReport.js
// Author: A. Hutchinson IV  Date: 2/17/2021
// Copyright 2021 by A. Hutchinson IV
// 
// This file defines the API routes for instructor's modal
// object.
// API
//  Resource                        Req Verb            Description                 Status Code
//  /modalReport?p=PP&d=DD&e=EE       GET          Retrieve all worksessions,        200 (OK)
//                                                 full name, project name,          212(partial information)
//                                                 total hours worked, and
//                                                 end date for email EE on 
//                                                 project PP        
//                                                                                  
//



const router = require("express").Router();
const SessionTime = require("../models/session-time");
const User = require("../models/user");
const Project = require("../models/project");

// GET route to find data to populate modal on instructor page
router.get("/",async function(req, res){
    let projectQuery = req.query.p;
    let dateQuery = req.query.d;
    let emailQuery = req.query.e;
    let startDate = new Date(Date.parse(dateQuery));
    let endDate = addSevenDays(startDate);
    

    // to fix problem with spaces before and after emails
    emailQuery = emailQuery.replace(' ','');

    // finds all sessions
    let sessions = await SessionTime.find({owner: emailQuery, project: projectQuery, date: {$gte: startDate, $lte: endDate}});

    // calculates total hours spent for each session
    let timeWorked = 0;
    sessions.forEach(function(session){
        timeWorked += hoursWorked(session.startHr, session.startMin, session.finishHr, session.finishMin);
    })

    // finds project
    let project = await Project.findOne({projCode: projectQuery});
    let projectName = project.name;

    // finds user
    let user = await User.findOne({email: emailQuery});
    let stuFullName = user.fname + " " + user.lname;

    // if there are sessions found
    if(sessions != null){
        res.status(200).send({status: 200, name: stuFullName, projectName, totalHrs: timeWorked.toFixed(1), endDate, sessions});
    }
    else{
        res.status(212).send({status: 404, name: stuFullName, projectName, msg: "No projects"})
    }
});


module.exports = router;

// To add seven days to your start date
function addSevenDays(startingDate){
    var endDate = new Date(startingDate);
    endDate.setDate(endDate.getDate() + 7);
    year = endDate.getFullYear();
    month = endDate.getMonth() + 1;
    date = endDate.getDate();
    return year+"-"+month+"-"+date;
}

// To calculate total hours worked
function hoursWorked(startHr, startMin, finishHr, finishMin){
    let total = 0; 
    let hrs = finishHr - startHr;
    let mins = (finishMin - startMin)/60;
    total = total + hrs + mins;
  return total
}