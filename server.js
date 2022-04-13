const express = require('express'),
fileupload = require("express-fileupload"),
app = express(),
bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

port = process.env.PORT || 3008;

app.listen(port);

// Public Folder
app.use(express.static('./public'));
app.use(fileupload());

// Views
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

console.log(':::::: | Project: '+process.env.PROJECT+' | ::::::');
console.log('Date: ' + new Date());
console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/appRoute'); //importing route
routes(app); //register the route