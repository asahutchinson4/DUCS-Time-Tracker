// File: session-time.js
// Author: S. Sigman    Date: 11/11/2020
// Copyright 2021 by Scott Sigman.
//
// This file defines the schema for work session objects.
//
// Modifications
// 1/20/2021 Reused from App Dev I project of Fall 2020. S. sigman
// 1/20/2021 Adapted to use owner email & project id. Added 
//           description property. S. Sigman

var db = require("../db");
var mongoose = require("mongoose");

var SessionTime = db.model("SessionTime", {
    owner: {type: String, required: true}, // owner's email
    project: {type: String, required: true}, // project id (not objectID)
    date:      {type: Date, min: new Date("2004-08-15"), default: Date.now, required: true},
    startHr:   {type: Number, min: 0, max: 23, required: true},
    startMin:  {type: Number, min: 0, max: 59, required: true},
    finishHr:  {type: Number, min: 0, max: 23, required: true},
    finishMin: {type: Number, min: 0, max: 59, required: true},
    code: { type: Number, min: 10, max: 90, default: 10, required: true},
    code90Desc: {type: String, default: ""},
    description: {type: String, required: true }
});

module.exports = SessionTime;