// File timeCardModal.js
// Author: A. Hutchinson IV  Date: 5/5/2021
// Copyright 2021 by A. Hutchinson IV
// 
// This file defines the API routes for timecard modal
// object.
// API
//  Resource                        Req Verb            Description                 Status Code
//  /timeCardModal?e=EE               GET          Retrieve all worksessions,        200 (OK)
//                                                 project names,                    212(partial information)
//                                                 total hours worked, and
//                                                 amount of projects for email EE
//                                                         
//                                                                                  
//



const router = require("express").Router();
const SessionTime = require("../models/session-time");
const User = require("../models/user");

// GET route to find data to populate modal on instructor page
router.get("/",async function(req, res){
    let emailQuery = req.query.e;
    
    // to fix problem with spaces before and after data
    emailQuery = emailQuery.replace(' ','');

    // find one user that matches current user's email
    let user = await User.findOne({email: emailQuery});

    // finds all sessions
    let sessions = await SessionTime.find({owner: emailQuery});

    // calculates total hours spent for each session
    let timeWorked = 0;
    sessions.forEach(function(session){
        timeWorked += hoursWorked(session.startHr, session.startMin, session.finishHr, session.finishMin);
    })


    // if there are sessions found
    if(sessions != null){
        res.status(200).send({status: 200,totalHrs: timeWorked.toFixed(1), timecards: sessions, projects: user.projects, amountOfProjects: user.projects.length});
    }
    else{
        res.status(212).send({status: 404,  msg: "No timecards"})
    }
});


module.exports = router;


// To calculate total hours worked
function hoursWorked(startHr, startMin, finishHr, finishMin){
    let total = 0; 
    let hrs = finishHr - startHr;
    let mins = (finishMin - startMin)/60;
    total = total + hrs + mins;
  return total
}