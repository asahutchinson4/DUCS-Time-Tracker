// File project.js
// Author: S. Sigman  Date: 1/25/2021
// Copyright 2021 by S. Sigman
// 
// This file defines the API routes for project
// objects.
// API
//  Resource       Req Verb  Description               Status Code
//  /project?u=UU     GET    Retrieve all projects     200 (ok)
//                           for user UU                
//                                                     404 (user not found)
// 
// Modifications

const router = require("express").Router();
const User = require("../models/user");

router.get('/',(req,res) => {
    console.log(`Projects for user ${req.query.u} requested`);
    User.find({email: req.query.u}, (err, users) => {
        if(users[0]) {
            // assert: user found
            // return their projects
            res.status(200).json(users[0].projects);
        }
        else {
            res.status(404).send({msg: "No projects found."});
        }
    });
});

module.exports = router;