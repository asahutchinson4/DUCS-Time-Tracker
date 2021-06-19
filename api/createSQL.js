// File createSQL.js
// Author: A. Hutchinson IV  Date: 2/22/2021
// Copyright 2021 by A. Hutchinson IV
// 
// This file defines the API routes for creating a user
// in the mySQL database.
// API
//  Resource                        Req Verb            Description                 Status Code
//  /createSQL                        POST          Save new users in SQL                200 (OK)
//                                                  database
//                                                                            

const bodyParser = require("body-parser");
const router = require("express").Router();
const User = require("../models/user");
const bcrpyt = require("bcryptjs");
const conn = require("../mysqldb");

router.use(bodyParser.json());

router.post('/', (req,res) => {

    // hash the password
    const hash = bcrpyt.hashSync(req.body.password, 10);

    // query to create new user
    let qry = `INSERT INTO user (email, password, fname, lname, role, created)
               VALUES ("${req.body.email}", "${hash}", "${req.body.fname}", 
               "${req.body.lname}", "${req.body.role}", "${req.body.created}");`;
           
    conn.query(qry, (err, rows) => {

        if (err) return res.status(500).json({error: err});
     
        // save user to database and send user info back
        res.json(qry);
    })
});

module.exports = router;