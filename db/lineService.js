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

    newLineLineSchedule.save(function(err) {
        if (err) throw err;
    });
}

var deleteSchedules = function() {
    return new Promise(function(resolve, reject) {
        LineSchedule.remove({}, function(err) {
            if (err) throw err;
            resolve();
        });
    });
}

var getLines = function() {
    return new Promise(function(resolve, reject) {
        Line.find({}).select('number in_stop out_stop -_id').exec(function(err, lines) {
            if (err) throw err;
            resolve(lines);
        });
    });
}

var getLine = function(lineNumber) {
    return new Promise(function(resolve, reject) {
        var line = Line.find({ number: lineNumber.toUpperCase() }).select('number in_stop out_stop').exec(function(err, lines) {
            if (err) reject(err);
            var lineData = lines[0];
            var schedule = LineSchedule.find({ line: lineData._id }).exec(function(err, lineSchedule) {
                if (err) reject(err);
                var scheduleData = lineSchedule[0];
                var lineJSON = {
                    number: lineData.number.toUpperCase(),
                    in_stop: lineData.in_stop,
                    out_stop: lineData.out_stop,
                    schedule: {
                        weekdays: scheduleData.weekdays,
                        saturday: scheduleData.saturday,
                        sunday: scheduleData.sunday
                    }
                }
                resolve(lineJSON);
            });
        });
    });
}

module.exports = {
    insertLine: insertLine,
    deleteLines: deleteLines,
    insertSchedule: insertSchedule,
    deleteSchedules: deleteSchedules,
    getLines: getLines,
    getLine: getLine
}