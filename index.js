const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

var lines = require('./lines');

app.get('/lines', function(req, res) {
    var linesJSON = lines.getLines();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(linesJSON));
});

app.get('/lines/:lineNumber', function(req, res) {
    var linesJSON = lines.getLine(req.params.lineNumber);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(linesJSON));
});

app.listen(PORT, function() {
    console.log('BusRider server listening on port ' + PORT);
});