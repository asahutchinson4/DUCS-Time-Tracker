// File: db.js
// Author: S. Sigman    Date: 11/11/2020
// Copyright 2021 by Scott Sigman
//
// This file defines the database connection for the app.
// 
// Modifications:
// 1/17/2021 Reused code from App Dev I 2020 project. S. Sigman
//

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/ducs_tra", { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = mongoose;