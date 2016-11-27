'use strict';

var Gun = require('gun');
var http = require('http');
var fs = require('fs');
var express = require('express');


var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));


// Saves all data to `data.json`.
var gun = Gun({
    file: 'data.json',
});

gun.wsp(app);


// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
});



