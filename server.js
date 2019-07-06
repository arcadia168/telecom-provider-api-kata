// server.js

// modules =================================================
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')
var methodOverride = require('method-override');
var mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
var dbconfig = require('./config/db');
var routes = require('./src/server/routes');

// configuration ===========================================
var app = express();

// config files

// set our port
var port = process.env.PORT || 8080; // 8080 is detault Google Cloud port

// connect to our mongoDB database
mongoose.connect(dbconfig.url, {useNewUrlParser: true});
const database = mongoose.connection
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', () => {
    console.log(`Connected to the MongoLab MongoDB!`);
});

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
routes(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
