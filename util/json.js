var fs = require('fs');

const jsonDir = './json';

/**
 * Creates a JSON object and writes it to a file
 * @param {Array} obj - The object to be converted to a json
 * @param {String} fileName - The name of the file to which to write the json
 */
var createJSON = function(obj, fileName) {

    var json = JSON.stringify(obj);
    //TODO: implement some kind of logging
    if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir);
    }
    fs.writeFile(jsonDir + '/' + fileName + '.json', json, 'utf8', function(err) {
        if (err)
            console.log(err);
    });

}

/**
 * Searches for an element in a JSON array
 * @param {Array} obj - The JSON array
 * @param {String} property - The name of the key that is being searched
 * @param {String} value - The value to search for
 * @return {Numeric} The index of the found element. If nothing is found, then -1 is returned
 */
var find = function(obj, property, value) {
    for (i = 0; i <= obj.length; i++) {
        if (obj[i][property] == value)
            return i;
    }
    return -1;
}

module.exports = {
    createJSON: createJSON,
    find: find
}