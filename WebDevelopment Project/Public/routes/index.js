var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var UserDb = require('../models/UserDB');
var User = require('../models/User');
var UserConnection = require('../models/UserConnection');
var Userprofiledb = require('../models/UserProfileDB');
const { check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var urlencoded = bodyparser.urlencoded({ extended: false });
var conndb = require('../models/ConnectionDB');
var modconn=require('../models/connection');
var mongoose = require('mongoose');

var db = 'mongodb://localhost/codehereconnections';
mongoose.connect(db);
mongoose.Promise = global.Promise;

var login = false;

// about page
router.get('/about', function(req, res) {
    res.render('pages/about',{ isLoggedIn: login, err: "", error: undefined, user: req.session.theUser })
});

// contact page
router.get('/contact', function(req, res) {
    res.render('pages/contact',{ isLoggedIn: login, err: "", error: undefined, user: req.session.theUser })
});

// savedconnections Page
router.get('/savedconnections', function (req, res) {

    if (!login) {
  res.render('pages/login', { isLoggedIn: login, err: "", error: undefined, user: req.session.theUser });
        }
    else {
        console.log(" reached else here" + login);
        UserDb.getUsers().exec(function (err, res1) {
            if (err) {
                console.log('err');
                throw err;
            }
            console.log("req.session.UserID")
            console.log(req.session.UserID);
        })
        UserDb.getUserConnectionsWithCode(req.session.UserID).exec(function (err, result) {//gets userjobs based on the userId
            if (err) throw err;
            console.log("we r here in");
            console.log(result);

            console.log(login);
            res.render('pages/savedconnections', { data: result, isLoggedIn: login, user: req.session.theUser });
        })


    }
});

router.post('/savedConnections', urlencoded, function (req, res) {
    var task = req.body.action;

    switch (task) {
        case "delete":
            if (login) {
                var act = req.body.actionOp;
                var delitem = req.body.connectionName;
                UserConnection.deleteOne({ connectionName: delitem }).exec(function (err, Item) {
                    if (err) throw err;
                })

                res.redirect('/savedConnections')
            } else {

              res.render('pages/login', { isLoggedIn: login, err: "", error: undefined, user: req.session.theUser });
            }
            break;
        case "update":

            console.log(req.session.theUser);
            if (login) {
                UserConnection.findOneAndUpdate({
                    UserID: req.session.UserID,
                    connectionName: req.body.connectionName,
                },
                    {
                        connectionName: req.body.connectionName,
                        rsvp: req.body.rsvp,
                        connectionTopic: req.body.connectionTopic,
                    },
                    { upsert: true, returnNewDocument: true }).exec(function (err, cons) {
                        if (err) throw err;
                    });
                res.redirect('/savedConnections');
            }
            else {
                res.render('pages/login', { isLoggedIn: login, err: "", error: undefined, user: req.session.theUser })
            }
            break;

    }
});

// new Connection
router.get('/newConnection', function(req, res) {

  if (login) {

        res.render('pages/newConnection', { isLoggedIn: login, error: undefined, user: req.session.theUser });
    }
    else {
        res.render('pages/login', { isLoggedIn: login });
    }

});

router.post('/newConnection', urlencoded, [check('connectionName').isAlpha().withMessage('connectionName must be alphabets without space'),
    check('connectionTopic').isAlpha().withMessage('connectiontopic must be alphabets without space'),
    check('location').isAlpha().withMessage('location must be alphabets without space'),
        check('details').isLength({min:2}).withMessage('details must alphabets'),
    check('dateandtime').isISO8601().withMessage('dateandtime must be a valid date')], function (req, res) {
        const errors = validationResult(req);
        console.log(errors);
        console.log(errors.mapped());
        if (!errors.isEmpty()) {
            res.render('pages/newConnection', { isLoggedIn: login, error: errors.array(), user: req.session.theUser });
            return;

}
  else {
            console.log("session user :"+req.session.UserID);
    var newConnection = [{ UserID: req.session.UserID, connectionName: req.body.connectionName, details: req.body.details, dateandtime: req.body.dateandtime, imageurl: req.body.imageurl,  connectionTopic: req.body.connectionTopic, location: req.body.location}];
    var save = [{UserID: req.session.UserID,connectionName: req.body.connectionName,connectionTopic: req.body.connectionTopic,rsvp:"yes"}];
    modconn.find({ connectionName: req.body.connectionName, connectionTopic: req.body.connectionTopic }).exec(function (err, docs) {
        if (err) throw err;

        if (docs.length == 0) {
           modconn.insertMany(newConnection, function (err, docs) {
                if (err) throw err;
            })


        }

    })
    UserConnection.find({ connectionName: req.body.connectionName, connectionTopic: req.body.connectionTopic }).exec(function (err, docs) {
        if (err) throw err;

        if (docs.length == 0) {
           UserConnection.insertMany(save, function (err, docs) {
                if (err) throw err;
            })


        }

    })
  }

    res.redirect('/savedconnections');

});

router.get('/Connection/:connectionName', urlencoded, [check('connectionName').isAlpha().escape().trim().withMessage('connectionName must be alphabets')], function (req, res) {

  const errors = validationResult(req);
  console.log(errors);
  console.log(errors.mapped());
  if (!errors.isEmpty()) {
      res.render('pages/error', { isLoggedIn: login, error: errors.array(), user: req.session.theUser });
      return;
} else{

    conndb.getConnectionByName(req.params.connectionName).exec(function (err, data1) {

        console.log("inside dat1",data1.length);
        if(data1.length ==0){
          console.log("inside the if")
          res.render('pages/error', { isLoggedIn: login, error: errors.array(), user: req.session.theUser });
          return;

        }
        else{
          console.log("inside the elsse")
          req.session.connectionName = data1[0].connectionName;
          res.render('pages/connection', { qs: data1, isLoggedIn: login, UserID: req.session.UserID, user: req.session.theUser });
            return;



        }
              });

  }

});

router.get('/connections', function (req, res) {
    conndb.getConnections().exec(function (err, data) {
        if (err) throw err
        conndb.getCategory().exec(function (err, category) {
            if (err) throw err
            res.render('pages/connections', { data: data, category: category, isLoggedIn: login, user: req.session.theUser });
        })
    })
});



// Login Page:
router.get('/login',function(req,res){

  if (!login) {

    res.render('pages/login', { isLoggedIn: login, err: "", error: undefined, user: req.session.theUser });
    return;

    }
    res.redirect('/savedconnections');

});

router.post('/login', urlencoded, [
    check('username').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 5, max: 54 })
        .withMessage('Enter a valid password')], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            res.render('pages/login', { isLoggedIn: login, error: errors.array(), err: undefined, user: req.session.theUser });
        }
        else {
            var username = req.body.username;
            var password = req.body.password;
            var saltrounds = 10;
            UserDb.getLoginData(username).exec(function (err, docs) {
                //console.log(docs)
                if (docs.length == 0) {
                    res.render('pages/login', { isLoggedIn: login, err: "Invalid Username/Password", error: undefined, user: req.session.theUser });
                }
                else {
                    console.log('here it is');
                    //console.log(docs[0]);
                    var hash = bcrypt.hashSync(docs[0].password, saltrounds);//generating hash for password
                    var phash = bcrypt.compareSync(password, hash);//comapring password against hash
                    if (phash == true) {
                        UserID = (docs[0].UserID);
                        req.session.theUser = docs[0];
                        req.session.UserID = UserID;
                        console.log(req.session.UserID);
                        login = true;

                        res.redirect('/savedconnections')

                    }
                    else {
                        res.render('pages/login', { isLoggedIn: login, err: 'invalid password', error: undefined, user: req.session.theUser });
                    }
                }
            })
        }
});


//Logout:
router.get('/logout', function (req, res) {
    login = false;
    req.session.destroy();
    res.render('pages/index', { isLoggedIn: login });
});

// home
router.get('/', function(req, res) {
    res.render('pages/index',{ isLoggedIn: login, err: "", error: undefined, user: req.session.theUser })
});

module.exports = router;
