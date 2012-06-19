define('js/app',[
    'jquery',
    'handlebars',
    'couchr',
    'JSONStream',
    'underscore'

],
function($, handlebars, couch, JSONStream, _){
    var exports = {};

    exports.init = function() {
            console.log('in init');
    }


    exports.ui = function(){
        $('form').submit(function() {
            try {
                 //$('.results').html(templates['loading.html']());
                 var text = $('.search-query').val();
                 var terms = text.toLowerCase().split(' ');

                 terms = _.filter(terms, function(term) { return (term.length > 1); });

                 word_count(terms, function(err, results) {
                     if (err) return console.log(err);
                     //$('.word-count').html(templates['word_count.html'](results));
                     //$('.results').html(templates['results.html']());
                     var url = build_search_url(results);
                     var path = window.location.pathname + url + '?d=' + new Date().getTime();
                     var xhr = new XMLHttpRequest()
                     xhr.open("GET", path, true);
                     var stream = new JSONStream.XHRStream(xhr)
                     var json = JSONStream.parse([/./])
                     stream.pipe(json)
                     json.on('data', function(doc) {

                     });


                 });
            }
            catch (ignore) { }

            return false;
        });
    }



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


    function word_intersection(results, callback) {
        var intersection = _.intersection.apply(null, _.values(results));
        callback(intersection);
    }

    function display(torrents) {
        $('.results').html(templates['results.html'](torrents));
    }

    function build_search_url(word_counts) {
        var smallest = _.min(word_counts, function(term){ return term.value });
        var url = "_search/" + smallest.key;
        if (word_counts.length > 1) {
            var first = true;
            var other = _.each(word_counts, function(term){
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



