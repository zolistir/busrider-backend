var mongoose = require('mongoose');
var Line = require('./line');
var LineSchedule = require('./lineSchedule');

const connectionString = 'mongodb://localhost/busrider';

mongoose.connect(connectionString, function(err) {
    if (err)
        throw err;
});

var insertLine = function(line) {
    var newLine = new Line({
        _id: new mongoose.Types.ObjectId(),
        number: line.number,
        in_stop: line.in_stop,
        out_stop: line.out_stop
    });

    newLine.save(function(err) {
        if (err) throw err;
        console.log('Line saved');
    });

    return newLine._id;
}

var deleteLines = function() {
    Line.remove({}, function(err) {
        if (err) throw err;
        console.log('Lines removed');
    });
}

var insertSchedule = function(lineSchedule) {

}

var deleteSchedules = function() {

}

module.exports = {
    insertLine: insertLine,
    deleteLines: deleteLines,
    insertSchedule: insertSchedule,
    deleteSchedules: deleteSchedules
}