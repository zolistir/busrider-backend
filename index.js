var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;

var lines = require('./lines');

app.get('/lines', function(req, res) {
    lines.getLines().then(function(linesJSON) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(linesJSON));
    }, function(err) {
        console.log(err);
        res.status(404);
        res.send("There was an error retrieving the data");
    });
});

app.get('/lines/:lineNumber', function(req, res) {
    lines.getLine(req.params.lineNumber).then(function(linesJSON) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(linesJSON));
    }, function(err) {
        console.log(err);
        res.status(404);
        res.send("There was an error retrieving the data");
    });
});

app.listen(PORT, function() {
    console.log('BusRider server listening on port ' + PORT);
});