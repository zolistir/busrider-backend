var mongoose = require('mongoose');

var lineSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: String,
    in_stop: String,
    out_stop: String
});

var Line = mongoose.model('Line', lineSchema);

module.exports = Line;