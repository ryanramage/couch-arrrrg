var jam = {
    "packages": [
        {
            "name": "JSONStream",
            "location": "jam/JSONStream",
            "main": "index.js"
        },
        {
            "name": "handlebars",
            "location": "jam/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        },
        {
            "name": "couchr",
            "location": "jam/couchr",
            "main": "couchr.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "tablesorter",
            "location": "jam/tablesorter",
            "main": "js/tablesorter.js"
        },
        {
            "name": "stream",
            "location": "jam/stream",
            "main": "stream.js"
        },
        {
            "name": "events",
            "location": "jam/events",
            "main": "events.js"
        }
    ],
    "version": "0.1.0"
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages});
}
else {
    var require = {packages: jam.packages};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
};