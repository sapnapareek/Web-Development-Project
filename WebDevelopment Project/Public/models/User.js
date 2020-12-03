// Connection Schema interfaces with  to DB codehereconnections

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codehereconnections');

var userSchema = new mongoose.Schema({
    UserID: String,
    firstName: String,
    lastName: String,
    emailAddress: String,
    address1Field: String,
    address2Field: String,
    city: String,
    state: String,
    zipcode: Number,
    country: String,
    password: String
},{collection:'userdata'});

var userData = mongoose.model('userdata', userSchema);
module.exports = userData;
