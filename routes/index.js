//var express = require('express');
"use strict";
var express = require('express');
var router = express.Router();
var standupCtrl = require('../controllers/standup.server.controller.js');
/* GET home page. */
router.get('/', function (req, res, next) {
    return standupCtrl.list(req, res); //This is why you should make an interface for your controllers for intellisense 
});
//SETUP ROUTES FOR OUR standup.server.controller.ts
/* GET New Note Page. */
router.get('/newnote', function (req, res) {
    return standupCtrl.getNote(req, res);
});
router.post('/newnote', function (req, res) {
    return standupCtrl.create(req, res);
});
router.post('/', function (req, res) {
    return standupCtrl.filterByMember(req, res);
});
/* Was able to post this data using postman on the post route /newnote:

{
   "memberName":"Bob",
   "project":"matrix",
   "workYesterday":"Build Out the Standup Meeting Node",
   "workToday":"Builded some stuff",
   "impediment":"None"
}
*/
module.exports = router;
/*
To start file look at the scripts section of package.json

{
  "name": "NodeJSTeamMeetingApp",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.15.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.2.0",
    "express": "~4.13.4",
    "hjs": "~0.0.6",
    "morgan": "~1.7.0",
    "serve-favicon": "~2.3.0",
    "swig": "^1.4.2"
  }
}

The script start starts the application,
you can redifine and call nodemon ./bin/www rather than node here
as a shortcut with node start.


Using MongoLab to deploy database in cloud
When connecting to MongoLab, we create a database called teammeetings.
Then we get this information:

To connect using the mongo shell:
mongo ds044229.mlab.com:44229/teammeetings -u <dbuser> -p <dbpassword>
To connect using a driver via the standard MongoDB URI (what's this?):
  mongodb://<dbuser>:<dbpassword>@ds044229.mlab.com:44229/teammeetings

  When connecting in robo mongo for address put:
  ds044229.mlab.com
 For port put: 44229
 Then in authentication tab put:
 Database Name: teammeetings

To get login and password must setup a demo user like this:
Log in to the mLab management portal
From your account’s Home page, navigate to the deployment
Navigate to the “admin” database listed in the “System Databases” section
Click the “Users” tab
Click the “Add database user” button to create a new user

 User Name: dbuser
 Password: dbpassword

///////////////////////////////////////////////////////////////////////////

Simple Schema Example

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zipCode: Number,
  createdOn: Date,
  isActive: Boolean
});

//To Build a Mongoose model from this schema, we simply need to pass into the mongoose model method
//First parameter is name of model, and second is the schema we want to build this model from
//A third optional parameter would specify the mongodb collection name you would want document instances of this
//model to be saved in
//Since I have not supplied that here, mongoose will provide a collection name from the model name given
//Mongoose will attempt to pluralize the model name, so we may end up with Customers with an s for the collection name
//If thats not the desired result or if the collection already exists and perhaps you need to match that name, simply
//provide that as the third argument

var Customer = mongoose.model('Customer', customerSchema);

//You can customize schema further to create more varied models from the same schema
customerSchema.add({discountCode: String});

var DiscountedCustomer = mongoose.model('DiscountedCustomer', customerSchema);


Allowed Mongoose Schema types and their Javascript Counterparts
Mongoose - Javascript
String - String
Number - Number
Date - Object
Buffer - Object
Boolean - Boolean
Mixed - Object //Flexibility to store a variety of data types in the same field use this
ObjectId - Object
Array - Array(Object)

///////////////////////////////////////////////////////////////
More Complex Example

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Child Address Schema

var addressSchema = new Schema({
  type: String,
  stree: String,
  state: String,
  country: String,
  postalCode: Number
});

//Parent Customer Schema
var customerSchema = new Schema({

name: {
        first: String,
        last: String
      },
address: [addressSchema] //Notice also we are allowing for an array of addresses
createdOn: {type: Date, default: Date.now},
isActive: {type: Boolean, default: true}
});

//Used object as schema type for createdOn and isActive fields.
//The object specifies the schema type, but also allows us to specify a default value


//One approach you will find useful is to seperate out schemas like how we did address.
//You certainly could have defined addressSchema right in the Customer Schema code, but less clean and not readable

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
Lets Model a Quiz Document

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Pre-define sub-documents
var subCategory = new Schema({
  name: String,
  description: String,
  isActive: Boolean
});

var subAnswers = new Schema({
answerText: String,
isCorrect:  Boolean,
displayOrder: Number
});

var subQuestions = new Schema({
  questionType: String, //Naming this type vs naming this questionType
                        //In the mongose schema, the use of type has a special meaning
  questionText: String,
  answers: [subAnswers]
}); => Lets change this schema to a bad schema which just uses the name type

var subQuestions = new Schema ({
  type: String, //What Mongoose is gunna do is look at that and cast the questions array in the main document
                //to type string which is bad
  text: String,
  answers: [subAnswers]

}); => But you need and what the property name to be type so how can you fix this. Do this:

var subQuestions = new Schema ({
  type: {type: String}, //Here we can retain the property name of type and to do this we have to pass in an object for
                        //the schema type. now doc saved in mongodb as you expect
  text: String,
  answers: [subAnswers]

});


 //Define main document schema

 var quizSchema = new Schema({
   name: String,
   description: String,
   categories: [subCategory],
   questions: [subQuestions]
 });

*/
