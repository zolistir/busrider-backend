var mongoose = require('mongoose');

var scheduleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    weekdays: {
        in_schedule: [{
            type: String
        }],
        out_schedule: [{
            type: String
        }]
    },
    saturday: {
        in_schedule: [{
            type: String
        }],
        out_schedule: [{
            type: String
        }]
    },
    sunday: {
        in_schedule: [{
            type: String
        }],
        out_schedule: [{
            type: String
        }]
    },
    line: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Line'
    }
});

var LineSchedule = mongoose.model('LineSchedule', scheduleSchema);

module.exports = LineSchedule;