'use strict';

module.exports = function (hbs) {
    hbs.registerHelper('ifc', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    return {
        'pt': function (timestamp) {
            return new Date(timestamp).toLocaleDateString('en-US', options);
        }
    };
}

