var $ = require('cheerio');
var decode = require('./decode');

/**
 * Parses the HTML for the specific elements that contain the line numbers and routes,
 * and adds them to an array which is used all over the module
 * @param {String} linesHTML - The string containing the HTML which basically is the whole CTP website with the lines
 */
var parseLinesHTML = function(linesHTML) {
    var lines = [];
    $('div.element', linesHTML).each(function(index, elem) {
        var line = {};
        var lineNumber = '';
        var lineArr = $(elem).attr('data-title').split(' ');
        for (i = 1; i < lineArr.length; i++) {
            if (i > 1)
                lineNumber = lineNumber + ' ';
            lineNumber = lineNumber + lineArr[i];
        }
        line.number = lineNumber;
        var routes = decode($('div.ruta', elem).html()).split(' - ');
        line.in_stop = routes[0];
        line.out_stop = routes[1];
        lines.push(line);
    });
    // TODO: Sort the lines

    return lines;
}

var parseLineScheduleHTML = function(html) {
    $('#CSVTableLV table tbody tr', html).each(function(index, elem) {
        console.log(elem);
    });
}

module.exports = {
    parseLinesHTML: parseLinesHTML,
    parseLineScheduleHTML: parseLineScheduleHTML
}