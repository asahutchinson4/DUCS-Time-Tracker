// File editTimeCard.js
// Author: A. Hutchinson IV  Date: 5/7/2021
// Copyright 2021 by A. Hutchinson IV
// 
// This file defines the API routes for editing
// time cards.
// API
//  Resource                        Req Verb            Description                                       Status Code
//  /editTimeCard                     POST           User selects a current                                200 (OK)
//                                                   time card from viewing                                400 (FAIL)
//                                                   modal then, the user can
//                                                   can edit any detail of it.
//                                                        
//                                                                                  
//



const router = require("express").Router();
const SessionTime = require("../models/session-time");


router.post("/",async function(req, res){
    let sHrMin = req.body.startTime.split(":");
    let fHrMin = req.body.finishTime.split(":");




    let timecard = await SessionTime.updateOne({_id: req.body.cookieID}, 
                                               {$set: {code: req.body.code,
                                                       code90Desc: req.body.code90Desc,
                                                       project: req.body.project,
                                                       date:  new Date(req.body.wsDate),
                                                       startHr: sHrMin[0],
                                                       startMin: sHrMin[1],
                                                       finishHr: fHrMin[0],
                                                       finsihMin: fHrMin[1],
                                                       description: req.body.desc
                                                    }});
    if (timecard){
        res.status(201).send({timecard});
    }
    else{
        res.status(404).send();
    }
});


module.exports = router;