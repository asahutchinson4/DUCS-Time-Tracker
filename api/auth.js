// File: auth.js
// Author:  A. Hutchinson IV   Date: 4/10/2021
// Copyright 2021 A. Hutchinson IV
// 
// This file defines a route to authenticate a user.
// API
//  Resource   Req Verb  Description               Status Code
//  /auth        POST    Authenticate User         200 (user authenticated)
//                                                 401 (authentication failed)
//

const bodyParser = require("body-parser");
const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jwt-simple");
const bcrpyt = require("bcryptjs");
const conn = require("../mysqldb");
const cookieParser = require("cookie-parser");


// for encoding/decoding JWT
const secret = "supersecret";

router.use(cookieParser());
router.use(bodyParser.json());

router.post('/',(req,res) => {
    // query string to check email
    let qry = `SELECT email, password, fname, lname, role, created FROM user WHERE email = "${req.body.email}"`;

    console.log(`Auth called for ${req.body.email}`);

    conn.query(qry, (err, rows) => {
        if (err) return res.status(500).json({error: err});
         // if there is more than one user found (error)
         if (rows.length != 1) {
            res.status(401).json({ msg: "User unauthorized"});
          }
          // if user is found
          else {
            user = rows[0];
            // check if the entered password matches the hashed password in the database
            if(bcrpyt.compareSync(req.body.password, user.password)){

                // initialize token
                const token = jwt.encode({username: req.body.email, password: req.body.password}, secret);

                // create cookie with user's email
                res.cookie("user email", req.body.email, {maxAge: 1000 * 60 * 60});

                // return message and few pieces of data
                res.status(200).json({msg: 'User authenticated', 
                                    fname: user.fname, 
                                    lname: user.lname, 
                                    role: user.role,
                                    token});
         }
         else {
             res.status(401).json({msg: 'User unauthorized'});
         }
        }
    });
    
});

module.exports = router;