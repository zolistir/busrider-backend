var mongoose = require('mongoose');
var Line = require('./line');
var LineSchedule = require('./lineSchedule');

const connectionString = 'mongodb://localhost/busrider';

mongoose.connect(connectionString, function(err) {
    if (err)
        throw err;
});

var insertLine = function(line) {
    return new Promise(function(resolve, reject) {
        var newLine = new Line({
            _id: new mongoose.Types.ObjectId(),
            number: line.number,
            in_stop: line.in_stop,
            out_stop: line.out_stop
        });

        newLine.save(function(err) {
            if (err) throw err;
            console.log('Line saved');
            resolve(newLine._id);
        });
    });
}

var deleteLines = function() {
    return new Promise(function(resolve, reject) {
        Line.remove({}, function(err) {
            if (err) throw err;
            console.log('Lines removed');
            resolve();
        });
    });
}

var insertSchedule = function(lineSchedule, lineId) {
    var newLineLineSchedule = new LineSchedule({
        _id: new mongoose.Types.ObjectId(),
        weekdays: lineSchedule.weekdays,
        saturday: lineSchedule.saturday,
        sunday: lineSchedule.sunday,
        line: lineId
    });

    console.log(lineSchedule);
    console.log(newLineLineSchedule);

    newLineLineSchedule.save(function(err) {
        if (err) throw err;
        console.log('Schedule saved');
    });
}

var deleteSchedules = function() {
    return new Promise(function(resolve, reject) {
        LineSchedule.remove({}, function(err) {
            if (err) throw err;
            console.log('Schedules removed');
            resolve();
        });
    });
}

module.exports = {
    insertLine: insertLine,
    deleteLines: deleteLines,
    insertSchedule: insertSchedule,
    deleteSchedules: deleteSchedules
}