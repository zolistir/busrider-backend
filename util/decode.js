var decode = function(str) {
    var myStr = str;
    var toBeDecoded = ['&#x21B;', '&#x103;', '&#x219;', '&#xE2;', '&#x218;', '&#x163;', '&#x15F;', '&#x103;', '&#x15E;'];
    var toBeReplacedWith = ['ț', 'ă', 'ș', 'â', 'ș', 'ț', 'ș', 'ă', 'Ș'];

    for (i = 0; i <= toBeDecoded.length; i++) {
        myStr = myStr.replace(toBeDecoded[i], toBeReplacedWith[i]);
    }

    return myStr;
}

module.exports = decode;