import * as Mongoose from 'mongoose';
import * as express from 'express';
import * as EventEmitter from 'events';

var Standup: Mongoose._mongoose.IModelConstructor<{}> & EventEmitter.EventEmitter = require('../models/standup.server.model.js');

exports.create = function(req: express.Request, res: express.Response) { //create function we will use to save form data to mongodb with
    //We will obtain the form data from the request argument that is passed into our function
    //req.body => brings the form data along with it
    var entry = new Standup({
        memberName: req.body.memberName,
        project: req.body.project,
        workYesterday: req.body.workYesterday,
        workToday: req.body.workToday,
        impediment: req.body.impediment
    });  

    entry.save(); //Usually you want to pass a callback function for errors. 

    //redirect to home page...
    res.redirect(301, '/'); //301 response code and slash 
}; //Lets use postman to test this 

//This method will render a view called newnote for us, and pass in a title called Standup - New Note
exports.getNote = function(req:express.Request, res: express.Response){
    res.render('newnote', {title: 'Standup - New Note'});
}

exports.list = function(req: express.Request,res: express.Response){
 var query = Standup.find();
 query.sort({createdOn: 'desc'}) //ask it to be sorted on date in descending order
      .limit(12) //Specifies maximum number of results query will return and cannot be used with distinct 
      .exec(function(err, results){
          res.render('index', {title: 'Standup - List', notes: results}); //This is how you send data to view
      });
};

exports.filterByMember = function(req: express.Request, res : express.Response){
    var query = Standup.find();
    var filter = req.body.memberName;

    query.sort({createdOn: 'desc'});

    if(filter.length > 0){ //If the user actually sent a filter result, a memberName, string length
        query.where({memberName: filter})
    }

    query.exec(function(err, results){
        res.render('index', {title: 'Standup - List', notes: results});
    });
};

/*
What is the difference between exports and module.exports in Node.js?
You must be familiar with the exports object in Node.js modules, using which you create 
functions in your modules like this (assume in a file named rocker.js):

exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};

which you call from another file thus:

var rocker = require('./rocker.js');
rocker.name(); // 'My name is Lemmy Kilmister'

But what the heck is module.exports? Is it even legal?
Here is an eye-opener - module.exports is the real deal. exports is just module.exports's little helper. 
Your module returns module.exports to the caller ultimately, not exports. All exports does is collect properties 
and attach them to module.exports IF module.exports doesn't have something on it already. If there's something 
attached to module.exports already, everything on exports is ignored.
Put the following in rocker.js:

module.exports = 'ROCK IT!';
exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};
And this in another file, and run it:
var rocker = require('./rocker.js');
rocker.name(); // TypeError: Object ROCK IT! has no method 'name'

The rocker module completely ignored exports.name, and returned a string 'ROCK IT!'. From that you probably 
realize that your modules don't always have to be 'module instances'. Your modules can be any legal JavaScript 
object - boolean, number, date, JSON, string, function, array, and so on. Your module is whatever you set 
module.exports to. If you don't set module.exports to anything explicitly, the properties of exports and 
attached to it and returned.

In this case, your module is a class:
module.exports = function(name, age) {
    this.name = name;
    this.age = age;
    this.about = function() {
        console.log(this.name +' is '+ this.age +' years old');
    };
};

and you'd use it this way:
var Rocker = require('./rocker.js');
var r = new Rocker('Ozzy', 62);
r.about(); // Ozzy is 62 years old

In this case, your module is an array:

module.exports = ['Lemmy Kilmister', 'Ozzy Osbourne', 'Ronnie James Dio', 'Steven Tyler', 'Mick Jagger'];

and you may use it this way:
var rocker = require('./rocker.js');
console.log('Rockin in heaven: ' + rocker[2]); //Rockin in heaven: Ronnie James Dio

So you get the point now - if you want your module to be of a specific object type, 
use module.exports; if you want your module to be a typical module instance, use exports.
The result of attaching properties to module.exports is akin to attaching properties to exports. 
For example this

module.exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};

does the same thing as:
exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};

But note that, they are not the same thing. As I said earlier module.exports is the real deal, 
exports is just its little helper. Having said that, exports is the recommended object unless 
you are planning to change the object type of your module from the traditional 'module instance' to something else.

As long are you don't overwrite the module.exports object with an assignment operation
anything attached to module.exports and exports will be available in the 'required' module.

If this is the content of your module:
module.exports.age = 68;
exports.name = 'Lemmy Kilmister';

The following code would work fine:

var rocker = require('./rocker.js');
console.log('%s is %s', rocker.name, rocker.age); // Lemmy Kilmister is 68
BUT
if you overwrite module.exports with anything in your module, it will fail:

module.exports = 'LOL';
module.exports.age = 68;
exports.name = 'Lemmy Kilmister';
or
module.exports.age = 68;
exports.name = 'Lemmy Kilmister';
module.exports = 'WTF';

the order doesn't matter, rocker.age and rocker.name will now be undefined.
Also, note: just because module.exports.age and exports.name are exported, does not mean you should 
use a combination of both. My recommendation is to stick to exports.*, and be aware of module.exports.*.

*/