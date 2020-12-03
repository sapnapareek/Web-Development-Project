var user = require("../models/User");
var UserConnection = require("../models/UserConnection");
var connection = require('../models/ConnectionDB');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');
mongoose.Promise = global.Promise;

module.exports.getUsers = function () {
    var usr = user.find();
    return usr;
}

module.exports.getUserConnections = function () {
    var userconnections = UserConnection.find();
    return userconnections;
}

module.exports.getUser = function (uid) {
  var usercon = user.find({UserID: uid});
  return usercon;
}

module.exports.getLoginData = function(email) {
  var loginData = user.find({username: email});
  console.log('logindata');
    console.log(loginData);
    return loginData;
}

module.exports.getUserConnectionsWithCode = function (ucode) {
    var nameCode = UserConnection.find({ UserID: ucode })
    return nameCode;
}
