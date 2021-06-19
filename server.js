// File: server.js 
// Author: S. Sigman  Date: 12/30/2020
//
// server.js contains the code for the DTT Server component
// of the Ducs Time Tracker application.  Responsibilities of
// the server are:
//
//   1. Server the static web pages in the web component of 
//      the system.
//   2. Provide the DTT API for both the web and the mobile
//      components of the system.

// import the express server
const express = require("express");
const bodyParser = require("body-parser");

// import sessions
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

// application constants
const PORT = 3000;

// create the http app
const app = express();

const store = new MongoDBStore({
    url: 'mongodb://localhost:27017/ducs_sessions',
    collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
    console.log(error);
});

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

// set up a route to serve static pages from the public folder
app.use(express.static("public"));

// set up a route for sessions
app.use(session({
    secret: 'ab#d%^q1',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

// add a router
const router = express.Router();

// create API routes
router.use("/api/auth", require("./api/auth"));
router.use("/api/wsession", require("./api/wsession"));
router.use("/api/project", require("./api/project"));
router.use("/api/modalReport", require("./api/modalReport"));
router.use("/api/createMongo", require("./api/createMongo"));
router.use("/api/createSQL", require("./api/createSQL"));
router.use("/api/timeCardModal", require("./api/timeCardModal"));
router.use("/api/editTimeCard", require("./api/editTimeCard"));

// use the router in the app
app.use(router);

app.listen(PORT, (err) => {
    if (err) 
        console.log("Server startup failed.");
    else
        console.log(`Server listening on port ${PORT}`);
});




// mongod -dbpath ../MongoData/Spring2020
