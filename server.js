const express = require('express'),
fileupload = require("express-fileupload"),
app = express(),
bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// var OpenTok = require('opentok'),
// opentok = new OpenTok(process.env.OPENTOK_apiKey, process.env.OPENTOK_apiSecret);

port = process.env.PORT || 3008;

// Create a session and store it in the express app
// opentok.createSession({ mediaMode: 'routed' }, function (err, session) {
//     if (err) throw err;
//     console.log("session.sessionId:",session.sessionId);
//     app.locals.sessionId = session.sessionId;

//     // We will wait on starting the app until this is done
//     app.listen(port);
// });
app.listen(port);

// Public Folder
app.use(express.static('./public'));
app.use(fileupload());

// Views
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

console.log(':::::: | Project: Mosque | ::::::');
console.log('Date: ' + new Date());
console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/appRoute'); //importing route
routes(app); //register the route