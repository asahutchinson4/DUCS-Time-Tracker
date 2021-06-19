// File wsession.js
// Author: S. Sigman, A. Hutchinson IV  Date: 11/23/2020
// Copyright 2021 by S. Sigman, A. Hutchinson IV
// 
// This file defines the API routes for work session
// objects.
// API
//  Resource                Req Verb          Description                  Status Code
//  /wsession                 POST           Create a new worksession     201 (created)
//                                                                        401 (no account)
//                                                                        412 (no project)
//
//  /wsession?u=UU&p=PP       GET            Retrieve all worksessions    200 (OK)
//                                           for user UU on project PP    400 (no user or project)
//                                                

const bodyParser = require("body-parser");
const router = require("express").Router();
const SessionTime = require("../models/session-time");
const User = require("../models/user");
const Project = require("../models/project");
const session = require('express-session');
const cookieParser = require("cookie-parser");
// var MongoDBStore = require('connect-mongodb-session')(session);

router.use(bodyParser.json());
router.use(cookieParser());

let sess;

router.post("/", (req, res) => {
    console.log('Save route called');
    console.log(req.body);
    // get the user id - for sprint 3 get Donald Ducks document
    User.find({email: {$eq: req.body.owner}}, (err, users) => {
        // check to see if the user was found
        if (users[0]) {
          console.log(`Num User Projects: ${users[0].projects.length}`);

          // Search the list of users projects for the project
          let projFound = false;
          let i = 0;
          while (!projFound && i <users[0].projects.length) {
            if(users[0].projects[i].projCode == req.body.project ) {
              projFound = true;
            }
            i++;
          }
          console.log(`Project found: ${projFound}`);

          // assert:  the user was found
          // check that the user is part of the specified project
          if (projFound) {
            // assert: the project was found
            // make a session_time object from the post data
            let sHrMin = req.body.startTime.split(":"); // hh:mm
            let fHrMin = req.body.finishTime.split(":");

            let sessionTime = new SessionTime({
              owner: req.body.owner,
              project: req.body.project,
              date: new Date(req.body.wsDate),
              startHr: sHrMin[0],
              startMin: sHrMin[1],
              finishHr: fHrMin[0],
              finishMin: fHrMin[1],
              code: req.body.code,
              code90Desc: req.body.otherCategory,
              description: req.body.desc
            });
            
            // save the time session data to the database
            sessionTime.save();
            console.log(`user: ${users[0].lname}, ${users[0].fname} session saved.`);
            res.status(201).json({msg: "Session saved"});
          }
          else {
            // assert: no project found
            console.log(`No project: ${req.body.project} found`);
            res.status(412).json({msg: "No project for user."});
          }
        }
        else {
          // assert: the user was not found
          // send bad user or password error
          console.log("no account found");
          res.status(401).json({msg: "No account found"});
        }
    });
  });

  // GET route to find data to populate table on instructor page
  router.get("/", async function(req, res){
      sess = req.session;

      // some let variables
      let projectQuery = req.query.p;
      let dateQuery = req.query.d;
      let startDate = new Date(Date.parse(dateQuery));
      let endDate = addSevenDays(startDate);

      // finds project
      let project = await Project.findOne({projCode: projectQuery});
      let projectName = project.name;

      // if there are projects found
      if(project !=null){
        var userList = [];
        var wsessionList = [];

        // sorts project users by their email
        project.users.sort();

        // finds sessions for each user found on project
        for(u=0; u < project.users.length; u++){

          // finds all sessions
          let sessions = await SessionTime.find({owner: project.users[u], project: projectQuery, date: {$gte: startDate, $lte: endDate}});
          for(i = 0; i < sessions.length; i++){

            // creates json object for each session found
            let curSessionJson = {
              "owner": sessions[i].owner,
              "project": sessions[i].project,
              "date": sessions[i].date,
              "startHr": sessions[i].startHr,
              "startMin": sessions[i].startMin,
              "finishHr": sessions[i].finishHr,
              "finishMin": sessions[i].finishMin,
              "code": sessions[i].code,
              "code90Desc": sessions[i].code90Desc,
              "description": sessions[i].description
            }

            // adding found work sessions to the wsessions list 
            wsessionList.push(curSessionJson);
          }

          // calculates total hours spent for each session
          let timeWorked = 0;
          sessions.forEach(function(session){
              timeWorked += hoursWorked(session.startHr, session.startMin, session.finishHr, session.finishMin);
          })
          
          // finds user
          let user = await User.findOne({email: project.users[u]});

          // creates json object for user data
          let curUserJson = {
            "firstName": user.fname,
            "lastName": user.lname,
            "totalHrs": timeWorked.toFixed(1),
            "email": project.users[u]
          }

          userList.push(curUserJson);
        }

          wsessionList = JSON.stringify(wsessionList);

          // create cookie and put the list within it
          res.cookie("wsessions", wsessionList, {maxAge: 1000 * 60 * 60});
     
          
          res.status(200).send({sessions: userList, projectName, endDate});
        }
        else{
          res.status(404).send();
        }
  });

// Making it a node module
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
