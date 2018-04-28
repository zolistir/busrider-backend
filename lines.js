var jsonUtil = require('./util/json');
var htmlParse = require('./util/htmlParse');
var fs = require('fs');
var request = require('request');
var url = require('url');
var lineService = require('./db/lineService');

const ctpLineURL = 'http://ctpcj.ro/orare/csv/orar_{line_number}_{type}.csv'; // e.g. /orare/csv/orar_24B_lv.csv
const ctpLinesURL = 'http://ctpcj.ro/index.php/ro/orare-linii/linii-urbane';
const ctpMetroLinesURL = 'http://ctpcj.ro/index.php/ro/orare-linii/linii-metropolitane';
const ctpSupermarketLinesURL = 'http://ctpcj.ro/index.php/ro/orare-linii/linii-supermarket';

var lines = [];

/**
 * Makes a request to the CTP website and since there's no API,
 * get their whole page with the current available lines and parse it.
 */
var refreshRoutes = function() {
    var options = {
        url: ctpLinesURL,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    var del1 = lineService.deleteSchedules();
    var del2 = lineService.deleteLines();

    request(options, function(error, response, body) {
        var lines = htmlParse.parseLinesHTML(body);
        var lineType = lineService.getType("URBAN");
        Promise.all([lineType, del1, del2]).then(function(values) {
            lines.forEach(element => {
                element.type = values[0][0].id;
                var linePromise = lineService.insertLine(element);
                linePromise.then(function(lineId) {
                    refreshLine(element.number, lineId);
                });
            });
        });
    });

    options = {
        url: ctpMetroLinesURL,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    request(options, function(error, response, body) {
        var lines = htmlParse.parseLinesHTML(body);
        var lineType = lineService.getType("METROPOLITAN");
        Promise.all([lineType, del1, del2]).then(function(values) {
            lines.forEach(element => {
                element.type = values[0][0].id;
                var linePromise = lineService.insertLine(element);
                linePromise.then(function(lineId) {
                    refreshLine(element.number, lineId);
                });
            });
        });
    });

    options = {
        url: ctpSupermarketLinesURL,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    request(options, function(error, response, body) {
        var lines = htmlParse.parseLinesHTML(body);
        var lineType = lineService.getType("SUPERMARKET");
        Promise.all([lineType, del1, del2]).then(function(values) {
            lines.forEach(element => {
                element.type = values[0][0].id;
                var linePromise = lineService.insertLine(element);
                linePromise.then(function(lineId) {
                    if (element.number == 'VIVO!')
                        refreshLine('87B', lineId);
                    else
                        refreshLine(element.number.replace(' ', '').toLowerCase(), lineId);
                });
            });
        });
    });
}

/**
 * Get all the lines from local files
 */
var getLines = function() {
    var linesPromise = lineService.getLines();
    return linesPromise;
}

/**
 * Get a line from local files
 * @param {String} lineNumber - The line to fetch
 */
var getLine = function(lineNumber) {
    var linesPromise = lineService.getLine(lineNumber);
    return linesPromise;
}

/**
 * Create an object from the raw data from the website
 * @param {String} lineData - The raw schedule data from the CTP website
 */
var processLineData = function(lineData) {
    var linesArr = lineData.split('\n');
    var linesJSON = {};
    var inArr = [];
    var outArr = [];

    for (i = 0; i < 5; i++) {
        var thisLine = linesArr[i].split(',');
        linesJSON[thisLine[0]] = thisLine[1].replace('\r', '');
    }

    for (i = 5; i < linesArr.length; i++) {
        if (linesArr[i].length > 0) {
            var thisLine = linesArr[i].split(',');
            inArr.push(thisLine[0]);
            outArr.push(thisLine[1].replace('\r', ''));
        }
    }

    linesJSON['inSchedule'] = inArr;
    linesJSON['outSchedule'] = outArr;

    return linesJSON;
}

/**
 * Get the raw schedule data from the CTP website
 * @param {String} lineUrl - The url from which to get (weekdays, saturday, sunday)
 * @param {String} lineNumber - The line for which to get the schedule
 */
var requestLine = function(lineUrl, lineNumber) {

    // TODO: This accidentally works, but in the long run another solution is required
    var options = {
        url: lineUrl,
        headers: {
            'Content-Type': 'text/html',
            'Referer': ctpLinesURL + '/linia-' + lineNumber
        }
    };

    return new Promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (body.indexOf('404') != -1) {
                resolve('404');
            } else {
                var lineObj = processLineData(body);
                resolve(lineObj);
            }
        });
    });
}

/**
 * Call up the information from the CTP website for a certain line, and create a json file with the schedule arguments 
 * @param {String} lineNumber - The line number to refresh
 * @param {String} lineId - The line id to which to attach the information
 * @return {Object} - An object containing the arrays with the schedules for the requested line
 */
var refreshLine = function(lineNumber, lineId) {
    var csvURL = ctpLineURL.replace('{line_number}', lineNumber);
    var weekDaysURL = csvURL.replace('{type}', 'lv');
    var saturdayURL = csvURL.replace('{type}', 's');
    var sundayURL = csvURL.replace('{type}', 'd');
    var lineObj = {};

    var req1 = requestLine(weekDaysURL, lineNumber);
    var req2 = requestLine(saturdayURL, lineNumber);
    var req3 = requestLine(sundayURL, lineNumber);
    Promise.all([req1, req2, req3]).then(function(values) {
        var weekdays = {};
        var saturday = {};
        var sunday = {};

        if (values[0] != '404') {
            weekdays.in_schedule = values[0].inSchedule;
            weekdays.out_schedule = values[0].outSchedule;
        }
        if (values[1] != '404') {
            saturday.in_schedule = values[1].inSchedule;
            saturday.out_schedule = values[1].outSchedule;
        }
        if (values[2] != '404') {
            sunday.in_schedule = values[2].inSchedule;
            sunday.out_schedule = values[2].outSchedule;
        }

        lineObj.weekdays = weekdays;
        lineObj.saturday = saturday;
        lineObj.sunday = sunday;
        lineService.insertSchedule(lineObj, lineId);
    });
}

module.exports = {
    refreshRoutes: refreshRoutes,
    getLines: getLines,
    getLine: getLine
}