'use strict';

/**
 * Returns the value matching the mapping table
 *
 * If no match is found, the value itself is returned
 *
 * @param settings The data element settings
 * @returns {*}
 */
module.exports = function (settings) {

    function checkValue(dataElemValue) {
        try {
            for (var i = 0, l = settings.size; i < l; i++) {
                var method = settings[i].method;
                var out = settings[i].output;
                var inp = settings[i].input;

                if (method === 'is true') {
                    if (dataElemValue === true) {
                        return out;
                    }
                } else if (method === 'is false') {
                    if (dataElemValue === false) {
                        return out;
                    }
                } else if (method === 'exact match') {
                    if (dataElemValue === inp) {
                        return out;
                    }
                } else if (method === 'exact match i') {
                    if (dataElemValue.toLowerCase() === inp.toLowerCase()) {
                        return out;
                    }
                } else if (method === 'starts with') {
                    // Use regular expression and ignore startsWith
                    if((new RegExp('^'+inp)).test(inp)) {
                        return out;
                    }
                } else if (method === 'contains') {
                     if (dataElemValue.indexOf(inp) > -1) {
                        return out;
                    }
                } else if (method === 'regex') {
                    if (new RegExp(inp).test(dataElemValue)) {
                        return out;
                    }
                } else if (method === 'regex matching') {
                    var match = dataElemValue.match(new RegExp(inp));
                    if (match !== null) {
                        // We need to go top down to match $12 before matching $1
                        // match[0] is the whole match, thus we start / end with index 1
                        for (var j = (match.length - 1); j >= 1; j--) {
                            // Split-join is a way to replace all occurrences
                            out = out.split('$' + j).join(match[j]);
                        }
                        return out;
                    }
                }
            }
        } catch (e) {
            turbine.logger.error('Error during evaluation: ' + e.message);
        }

        if (settings.defaultValueEmpty === true) {
            return undefined;
        }
        return dataElemValue;
    }

    if (typeof settings !== 'undefined' && settings !== null) {
        var dataElemValue = settings.dataElement;
        if (typeof dataElemValue !== 'undefined' && dataElemValue !== null && Array.isArray(dataElemValue)) {
            return dataElemValue.map(checkValue);
        }
        return checkValue(dataElemValue);
    }
};

/**
 * IE compatibility is not needed
 */
