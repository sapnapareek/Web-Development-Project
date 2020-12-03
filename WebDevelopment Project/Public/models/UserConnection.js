var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');

var UserConnSchema = new mongoose.Schema({
    UserID: String,
    connectionName: String,
    connectionTopic: String,
    rsvp: String
});

var userConnectionDB = mongoose.model('userconns', UserConnSchema);
module.exports = userConnectionDB;
