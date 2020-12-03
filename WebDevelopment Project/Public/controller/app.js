
// express app,path and utility requires start
var express = require('express');
var app = express();
var path = require('path');
var index = require('../routes/index');
var session = require('express-session');
var connectionDB= require('../models/connectionDB');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');

// set views
app.set("views", "../views");
app.set('view engine', 'ejs');

app.use(express.static('../assets'));
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));

// uses the routes index page
app.use('/',index);
app.use('*',index);

app.listen(8084, function() {
    console.log('app started');
    console.log('listening on port 8084');
});
