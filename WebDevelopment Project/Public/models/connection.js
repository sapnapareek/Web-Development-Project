// Connection Schema interfaces with  to DB codehereconnections

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');

var ConnectionSchema = new mongoose.Schema({
    connectionId: Number,
    connectionName: String,
    connectionTopic: String,
    details: String,
    dateandtime: String,
    location: String,
    imageUrl:String,
    UserID: String
});

var connectionDB = mongoose.model('Connection', ConnectionSchema);
module.exports = connectionDB;
