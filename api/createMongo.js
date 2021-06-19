// File createMongo.js
// Author: A. Hutchinson IV  Date: 2/22/2021
// Copyright 2021 by A. Hutchinson IV
// 
// This file defines the API routes for creating a user
// in the mongo database.
// API
//  Resource                        Req Verb            Description                 Status Code
//  /createMongo                      POST          Save new users in mongo                200 (OK)
//                                                  database
//                                                                            

const bodyParser = require("body-parser");
const router = require("express").Router();
const User = require("../models/user");
const bcrpyt = require("bcryptjs");

router.use(bodyParser.json());

router.post('/', (req,res) => {

    // hash the password
    const hash = bcrpyt.hashSync(req.body.password, 10);

     // create new object for new user
     let newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hash,
        role: req.body.role,
        projects: req.body.projects
      });

      // save user to database and send user info back
      res.json(newUser);
      newUser.save();
});

module.exports = router;