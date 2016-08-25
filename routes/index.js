var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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


*/
