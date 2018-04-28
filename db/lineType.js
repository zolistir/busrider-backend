var mongoose = require('mongoose');

var lineTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: String
});

var LineType = mongoose.model('LineType', lineTypeSchema);

module.exports = LineType;