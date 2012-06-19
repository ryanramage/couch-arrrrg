define('js/app',[
    'jquery',
    'handlebars',
    'couchr',
    'JSONStream',
    'underscore',
    'tablesorter'

],
function($, handlebars, couch, JSONStream, _){
    var exports = {};

    var templates = {};
    handlebars.registerHelper('niceSize', function(size) {
        return formatSize(size);
    });


    function compileTemplate(domId, templateName) {
        var source   = $("#" + domId).html();
        templates[templateName] = handlebars.compile(source);
    }

    exports.init = function () {
        compileTemplate('loading-template', 'loading.html');
        compileTemplate('wordcount-template', 'word_count.html');
        compileTemplate('results-template', 'results.html');
        compileTemplate('row-template', 'row.html');
        compileTemplate('nofound-template', 'nofound.html');

    };


    exports.ui = function () {
        $('form').submit(function () {
            try {
                $('.results').html(templates['loading.html']());
                var text = $('.search-query').val();
                var terms = text.toLowerCase().split(' ');

                terms = _.filter(terms, function (term) {
                    return (term.length > 1);
                });

                word_count(terms, function (err, results) {
                    if (err || !results || results.length === 0) return $('.results').html(templates['nofound.html']());

                    $('.word-count').html(templates['word_count.html'](results));
                    $('.results').html(templates['results.html']());
                    var url = build_search_url(results);
                    var path = window.location.pathname + url + '?d=' + new Date().getTime();
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", path, true);
                    var stream = new JSONStream.XHRStream(xhr);
                    var json = JSONStream.parse([/./]);
                    stream.pipe(json);
                    json.on('data', function (doc) {
                        if (doc) {
                            $('.results tbody').append(templates['row.html'](doc));
                        } else {
                            // no results
                            $('.loading-icon').hide();
                        }
                    });
                    json.on('end', function () {
                        $('.loading-icon').hide();
                        $('table').tablesorter();
                    });


                });
            }
            catch (ignore) {
            }

            return false;
        });
    };



    function word_count(words, callback) {
        couch.get('_view/by_word', {
            keys : words,
            reduce: true,
            group: true
        },function(err, results) {
            if (err) callback(err);
            callback(null, results.rows);
        });
    }




    function build_search_url(word_counts) {
        var smallest = _.min(word_counts, function(term){ return term.value });
        var url = "_search/" + smallest.key;
        if (word_counts.length > 1) {
            var first = true;
            _.each(word_counts, function(term){
                if (term.key == smallest.key) return;
                var prepend = '/';
                if (!first)  prepend = '+';
                url += prepend + term.key;
                first = false;
            });
        }
        return url;
    }
    function formatSize(size) {
        var jump = 512;
        if (size < jump) return size + " bytes";
        var units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        var i=0;
        while (size >= jump && i < units.length) {
            i += 1;
            size /= 1024;
        }
        return size.toFixed(1) + ' ' + units[i - 1];
    }
    return exports;
});



