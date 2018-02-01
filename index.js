var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;

var lines = require('./lines');

app.get('/lines', function(req, res) {
    lines.getLines().then(function(linesJSON) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(linesJSON));
    });
});

app.get('/lines/:lineNumber', function(req, res) {
    lines.getLine(req.params.lineNumber).then(function(linesJSON) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(linesJSON));
    });
});

app.listen(PORT, function() {
    console.log('BusRider server listening on port ' + PORT);
});