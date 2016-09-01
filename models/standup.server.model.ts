//I am naming this standup.server.model.js MEAN.JS naming, 
//If I add angular to this, keeping models named liked this will help
//distinguish those models that are serverside from clientside 
/*
mongoose is a singleton, I've noticed a few other node modules do this too, like winston. 
That means any time you require mongoose, you're loading a reference to the same instance everywhere, 
connections and all.
*/

import {Mongoose} from 'mongoose';

var mongoose: Mongoose = require('mongoose');
var Schema = mongoose.Schema;

var standupSchema = new Schema({
    memberName: String,
    project: String,
    workYesterday: String, 
    workToday: String,
    impediment: String, 
    //createdOn: Date, but we want a current date or time automatically set, so use default value
    createdOn: {type: Date, default: Date.now} 
    //You may have noticed that we are not defining an id field here 
    //You may have noticed underscore id field in sample document 
    //If you do not define an id field, mongoose will create one for us by default
    //Schema type for this field is ObjectId, it can be anything unique including another object or subdoc so long
    //as it is unique
    //If for some reason we do not want or need an id field, we can disable that by passing a second arg to thes
    //schema constructor, with _id set to false.
});


// Expose (export) the model now...

module.exports = mongoose.model('Standup', standupSchema);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Tutorial Stuff

//id disabled schema example

var noIdSchema = new Schema({

    name: String,

}, { _id: false }); //Prevents mongoose from creating a default _id field for us

//Mongoose also provides us with an add method, where we can keep adding key value pairs to our schema, 
//Example of using Schema.add, can add one, or multiple properties
var aSchema = new Schema; //Empty example schema object

aSchema.add({ memberName: String }); //add just memberName

aSchema.add({ //Add multiple
    project: String,
    workYesterday: String,
    workToday: String
});

//Good for situations where we may want to define schema slightly different based on some criteria. 
//How about some cases we need to ask for a middle name and some cases we do not. Lets take a look at how that
//may be done. 
//Flexible Schema Editing...
var includeMiddleName = true;

var exampleSchema = new Schema;

if (includeMiddleName) {
    exampleSchema.add({
        memberName: {
            first: String,
            middle: String,
            last: String
        }
    });
} else {
    exampleSchema.add({
        memberName: {
            first: String,
            last: String
        }
    });
}

exampleSchema.add({
    project: String,
    workYesterday: String,
    workToday: String,
    impediment: String
});

//These Schema Definitions are just json. So you can load in a saved json file as your schema. 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//A mongoose document directly represents a document saved in a mongodb collection
//A document is simply an instance of the model

var personSchema = new Schema({
    firstName: String, 
    lastName: String
});

var Person = mongoose.model('Person', personSchema);

var bob = new Person({ //A single instance of the model, and called it bob, and supplied values to properties. 
        firstName: 'Bob',
        lastName: 'Doe'
});

//How about subdocuments?

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

var subQuestions = new Schema ({
  type: {type: String}, 
  text: String,
  answers: [subAnswers]
});

 var quizSchema = new Schema({
   name: String,
   description: String,
   categories: [subCategory],
   questions: [subQuestions]
 }); 

 //build a quiz model from the schema

 var Quiz = mongoose.model('Quiz', quizSchema);

 var quiz1 = new Quiz({
     name: 'Favourite Things Quiz',
     description: 'Demo Quiz',
     categories: [{
         name: 'Favourites',
         description: 'Favourite Things Quiz Category',
         isActive: true
     }]
    //abbreviated...
    //We are simply providing values to each of the properties to construct 
 });

//To save document through mongoose to mongodb:
var callbackFn;
quiz1.save(callbackFn);

//More cleaner way to construct these is like this: 

var categories  = [];

var cat1 = {name: 'Test1', description: 'Test 1 Category', isActive: 'true'};
var cat2 = {name: 'Test2', description: 'Test 2 Category', isActive: 'true'};

categories.push(cat1, cat2);

var questions = [];

var q1 = {
    type: 'Multiple-Choice', text: 'What is your favourite color?',
    answers: [
        { answerText: 'Red', isCorrect: false, displayOrder: 1 },
        { answerText: 'White', isCorrect: false, displayOrder: 2 },
        { answerText: 'Blue', isCorrect: true, displayOrder: 3 }
    ]
};

var q2 = {
    type: 'Multiple-Choice', text: 'What is your favourite animal?',
    answers: [
        { answerText: 'Dog', isCorrect: true, displayOrder: 1 },
        { answerText: 'Cat', isCorrect: false, displayOrder: 2 },
        { answerText: 'Squirrel', isCorrect: false, displayOrder: 3 }
    ]
};

questions.push(q1, q2);

//Create the parent quiz document - supply the categories and questions now...
var quiz2 = new Quiz({
    name : 'Example Quiz',
    description: 'Example Quiz long description...',
    categories: categories,
    questions: questions
});