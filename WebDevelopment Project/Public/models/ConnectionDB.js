//To query the data from DB

var Connection = require('../models/connection')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');
mongoose.Promise = global.Promise;


module.exports.getConnections = function () {
    var cons = Connection.find();
    return cons;
}

module.exports.getCategory = function () {
    var cots = Connection.distinct("connectionTopic");
    return cots;
}

module.exports.getConnection = function (connectionId) {
    var cId = Connection.find({ "connectionId": connectionId });
    return cId;
}

module.exports.getConnectionByName = function (name) {
    var con1 = Connection.find({ "connectionName": name } )
    return con1;
}
