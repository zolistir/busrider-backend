var mongoose = require('mongoose');
var Line = require('line');
var LineSchedule = require('lineSchedule');

const connectionString = 'mongodb://localhost/mongoose_basics';

var insertLine = function(line) {
    mongoose.connect(connectionString, function(err) {
        if (err)
            throw err;

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
    });
}

var deleteLines = function() {
    mongoose.connect(connectionString, function(err) {
        if (err)
            throw err;

        Line.remove({}, function(err) {
            if (err) throw err;
            console.log('Lines removed');
        });
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