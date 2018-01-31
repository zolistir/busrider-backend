var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('json/lines.json', 'utf8'));
var lines = require('./lines');

obj.forEach(line => {
    lines.refresh(line.number);
});