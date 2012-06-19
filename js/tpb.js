var db = require('db').use('_db');
var Handlebars = require('handlebars');
var templates = Handlebars.templates;
var http = require('http');


var _ = require('underscore')._;

var formatSize = function(size) {
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

$(function(){
     Handlebars.registerHelper('niceSize', function(size) {
      return formatSize(size);
    });


    function word_count(words, callback) {
        db.getView('couch-pirate','by_word', {
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


   $('form').submit(function() {
       try {
            $('.results').html(templates['loading.html']());
            var text = $('.search-query').val();
            var terms = text.toLowerCase().split(' ');

            terms = _.filter(terms, function(term) { return (term.length > 1); });

            word_count(terms, function(err, results) {
                if (err) return console.log(err);
                $('.word-count').html(templates['word_count.html'](results));
                $('.results').html(templates['results.html']());
                var url = build_search_url(results);
                var path = window.location.pathname + url + '?streamJson=true&d=' + new Date().getTime();
                http.get({path: path}, function(res) {
                    res.on('data', function(buf){
                        try {
                            var row = JSON.parse(buf);
                            setTimeout(function(){
                                $('.results tbody').append(templates['row.html'](row));
                            }, 1);
                        } catch(ignore){}
                    });
                    res.on('end', function(){
                        $('.loading-icon').hide();
                    });
                });
            });
       }
       catch (ignore) { }

       return false;
   });

});