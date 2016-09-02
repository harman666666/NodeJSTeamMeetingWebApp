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

//Custom Validators: 

var memberNameValidator = [
    function(val: string) {
        return (val.length > 0 && val.toLocaleLowerCase() != 'none')
    },
    //Custom error text...
    'Select a valid member name.' ];

var requiredStringValidator = [
    function(val){
        var testVal = val.trim();
        return (testVal.length > 0)
    }, 
    //Custom error text...
    '{Path} cannot be empty'
];

var standupSchema = new Schema({
    memberName: {
        type: String,
        required: true,
        validate: memberNameValidator
    },
    project: {
        type: String,
        required: true, 
        validate: requiredStringValidator
    },
    workYesterday: {
        type: String,
        required: true,
         validate: requiredStringValidator
    },
    workToday: {
        type: String,
        required: true,
         validate: requiredStringValidator
    },
    impediment: {
        type: String,
        required: true,
        default: 'none'
    },
    //createdOn: Date, but we want a current date or time automatically set, so use default value
    createdOn: { type: Date, default: Date.now }
    //You may have noticed that we are not defining an id field here 
    //You may have noticed underscore id field in sample document 
    //If you do not define an id field, mongoose will create one for us by default
    //Schema type for this field is ObjectId, it can be anything unique including another object or subdoc so long
    //as it is unique
    //If for some reason we do not want or need an id field, we can disable that by passing a second arg to thes
    //schema constructor, with _id set to false.
});


// Expose (export) the model now...
var Standup = mongoose.model('Standup', standupSchema);
module.exports = Standup;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Lets do some fun querying with the Standup Model////////////////////////////////////////RETRIEVING//////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
After I was done reading these, I was getting the error: 
DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own 
promise library instead: http://mongoosejs.com/docs/promises.html

To Fix:
The example in the doc is using the bluebird promise library but I chose to go with native ES6 promises.
In the file where I'm calling mongoose.connect:
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.7.0.3:27107/data/db');
*/
//mongoose.Promise = global.Promise;

//Signiture => Model.find(conditions, [fields], [options], [callback])////////////////////////

//No Callback, deferred execution
//When a call back is missing such as in this example, find will return a query object
//this query is not executed against the mongodb database, atleast not yet 
var query = Standup.find(); //Will return all of the documents 
                            //within the collection associated with this model




/*
//Simple Using CallBack /////////////////////////////////////////////////////////
var Person = mongoose.model('Person', yourSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})

//Simple using Query Variable /////////////////////////////////////////////////////////////

// find each person with a last name matching 'Ghost'
var query = Person.findOne({ 'name.last': 'Ghost' });

// selecting the `name` and `occupation` fields
query.select('name occupation');

// execute the query at a later time
query.exec(function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})

//Advanced using query variable//////////////////////////////////////////////////////////////
With a JSON doc
Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);
  
// Using query builder
Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').
  exec(callback);
*/

//With Callback, find method still returns a query, it is passed to the callback and immedietly
//executed.  
Standup.find(function(err, results){
    //handle the error...or Results here
    //results happens to be all the documents in the standup collection
});

//With Callback and Query conditions
Standup.find({memberName: 'David'}, function (err, results){
    //handles the error... oR rESULTS HERE, finds all documents where memberName = 'David'
});

//Limit the returned fields...
Standup.find({memberName: 'Mary'}, 'memberName impediment', function(err, results){
  //handles the error... oR rESULTS HERE, finds all documents where memberName = 'Mary'
  //The string representing the fields we wish to return are listed, it will just return these fields
  //from the objects, other fields in document will not be returned in these results 
});

// Signiture => Model.findOne(conditions, [fields], [options], [callback]) Returns only one document //////////

//No callback ... No conditions .. deferred execution 

var query2 = Standup.findOne();
query2.exec(function(err, results){ //execute method executes query. 
    //handle the error... Or Results here. 
}); 

//With conditions...
var query3 = Standup.findOne({memberName: 'Mark'});

// Signiture => Model.findById(id, [fields], [options], [callback]) ///////////////////////////////
//Find specific document by its unique id value. 
var id = '51253f34634d3252g'

var query4 = Standup.findById(id);
query4.exec(function(err, doc){
//handle the error... or results here
});
//Same as above, chained method calls
Standup.findById(id).exec(function(err, results){ //... 
    });

//By Id... Return every field BUT impediment...
var query5 = Standup.findById(id, '-impediment');
// This is one way to filter out the _id field in ur results and other fields

//Comparision Query Operators Here whcih are the same as in mongodb
/*
$gt => greater than
$gte => greater than or equal to
$in => exists in
$lt => less than
$lte => less than or equal to
$ne => not equal to
$nin => does not exist 

//Find Customers with discount >= 10...

Customer.find({discout: {$gte : 10, $lt: 20}}, function(err, results){
    if(err) throw err;
    console.log(results);
});

//Do the same thing with signiture => Model.where(path, [val]);
//The path is the name of the document field we are querying against 
//This could also be a nested path, like discount.amount or discount.percentage, 

Customer.where('discount').gte(10).lt(20).exec(function(err, results){
    if(err) throw err;
    console.log(results);
});


Customer.where('discount').gte(10).lt(20)
        .where('zipCode', '12345') //In this example, we are providing the optional 
                                   //val argument for the path which must match
        .exec(function(err, results){
    if(err) throw err;
    console.log(results);
});
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//UPDATING AND REMOVING DOCUMENTS/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//UPDATING//////////////////

/*
Standup.findById(id).exec(function (err, doc) { //Find a doc, thats one call to the database 

    //handle any errors
    if (err) throw err;

    //update the found document and save
   // doc.impediment('None');
    doc.save(function (err) { //Then second call to pass in the updated document 
        if (err) throw err;
        console.log('Document updated');
    });
});
*/

//A method that just calls the database once: 
//Signiture Model.update(conditions, update, [options], [callback])
//conditions argument has same purpose. 
/*
Example:
MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
MyModel.update({ name: 'Tobi' }, { ferret: true }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});

Options argument for the model update method:

safe (boolean) safe mode (defaults to value set in schema (true))
upsert (boolean) whether to create the doc if it doesn't match (false)
multi (boolean) whether multiple documents should be updated (false)
runValidators: if true, runs update validators on this command. Update validators 
               validate the update operation against the model's schema.
setDefaultsOnInsert: if this and upsert are true, mongoose will apply the defaults 
                     specified in the model's schema if a new document is created. 
                     This option only works on MongoDB >= 2.4 because it relies on MongoDB's $setOnInsert operator.
strict (boolean) overrides the strict option for this update
overwrite (boolean) disables update-only mode, allowing you to overwrite the doc (false)

//For instance say you want to update multiple documents that match the condition, 
//then set the multi option to true:

var condition = {firstName: 'Bob'};
var update = {firstName: 'Robert'};

Customer.update(condition, update, {multi: true}, function(err, raw){
    //Handles the error and raw response from MongoDB
});


*/

/*
var condition = {memberName: 'Mary'};
var update = {impediment: 'None - Mary no longer works here!' };

Standup.update(condition, update, function(err,  rawResponse){
    //Handle error or raw results here...
});

//Equivalent slow way is this
///Sometimes this is exactly what you want or need to do versus wondering if your condition bulk updated
//several documents then you intended by accident 
Standup.findOne({ memberName: 'Mary' }, function (err, doc) {
    //Handle errors here, validate doc results, etc/
   // doc.impediment = 'None Mary won the loterry and is on an island now';
    doc.save(function (err) {
        //Handle errors...
    });
});
*/

//REMOVING///////////////////////
//Signiture => Model.remove(conditions, [callback])

/*
var condition2 = {memberName: 'Mary'};
Standup.remove(condition2, function(err){
    //Handle error here...
});

//Remove any document created on or after Halloween day
var gteDate = new Date(2014, 10, 31);
Standup.remove({createdOn: {$gte: gteDate}}, function(err){
    //Handle errors here...
});

//Execute query w/o a callback function - does not wait on response
var query7 = Standup.remove({createdOn: {$gte: gteDate}});
query7.exec();


Signiture => Model.findByIdAndUpdate(id, update, [options], [callback])

Options:
new => Set to true to return the modified document rather than the original => Def val = true
upsert => Create the document if it does not match => Def Val = false
select => Specify the document fields to return

Signiture => Model.findByIdAndRemove(id, [options], [callback])
Options:
select => Specify the document fields to return
*/



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