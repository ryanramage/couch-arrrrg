/**
 * Created by JetBrains WebStorm.
 * User: ryan
 * Date: 12-03-26
 * Time: 12:05 AM
 * To change this template use File | Settings | File Templates.
 */

var db = require('db').use('_db');
var Handlebars = require('handlebars');
var templates = Handlebars.templates;



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



    function one_word_query(word, callback) {
        db.getView('couch-pirate','by_word', {
            key : '"' + word + '"',
            reduce: false
        },function(err, results) {
            if (err) callback(err);
            callback(null, _.pluck(results.rows, 'id'));
        });
    }

    function word_intersection(results, callback) {
        var intersection = _.intersection.apply(null, _.values(results));
        callback(intersection);
    }

    function display(torrents) {
        $('.results').html(templates['results.html'](torrents));
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
        });


        var by_word = {};
        var after = _.after(terms.length, word_intersection);
        _.each(terms, function(term) {
            one_word_query(term, function(err, results) {
                if (err) return console.log('cant get results for: ' + term);
                by_word[term] = results;
                after(by_word, function(intersection) {

                    //var first = _.first(intersection, 10);

                    db.bulkGet(intersection, {
                        include_docs : true
                    }, function(err, torrents) {
                        if (err) return console.log('cant get final torrents:' + err);
                        display(torrents);
                    })
                });
            })
        });
       }
       catch (e) { console.log(e);}

       return false;
   });

});