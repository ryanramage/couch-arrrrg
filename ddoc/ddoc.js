var _ = require('underscore')._;

exports.rewrites = [
    {from: '/_search/:key', to: '../couch-pirate/_list/intersection/by_word',  query: {include_docs : 'true', reduce: 'false', key: ':key' } },
    {from: '/_search/:key/:extra_keys', to: '../couch-pirate/_list/intersection/by_word',  query: {include_docs : 'true', reduce: 'false', key: ':key', extra_keys : ':extra_keys' } },
    {from: '/_db/*', to : '../../*'},
    {from: '/_db', to : '../../'},
    {from: '/bootstrap/*', to: '/bootstrap/*'},
    {from: '/', to: 'index.html'},
    {from: '/*', to: '*'}

];

var lists = {};


lists.id_only = function(head, req) {
   start({'headers' : {'Content-Type' : 'text/text'}});
   var row;
   while ((row = getRow())) {
       emit(row.key, '\n');
   }
}

lists.intersection = function (head, req) {

    var extraKeys = [];
    if (req.query.key) {
        extraKeys.push(req.query.key);
    }
    if (req.query.extra_keys) {
        var split = req.query.extra_keys.split(' ');
        extraKeys = extraKeys.concat(split);
    }

    extraKeys = _.uniq(_.map(extraKeys, function(key) {return key.toLowerCase()}));

    var realJson = true;
    if (req.query.streamJson) {
        realJson = false;
    }

    start({'headers' : {'Content-Type' : 'application/json'}});
    if (realJson) send('[\n');
    var count = 0;
    var row;
    while ((row = getRow())) {

        var doc_intersection = _.intersection(row.doc.tag, extraKeys);
        if (doc_intersection.length == extraKeys.length) {
            var res = {
                 id : row.id,
                 name : row.doc.name,
                 size : row.doc.size,
                 s : row.doc.s,
                 l : row.doc.l,
                 m : row.doc.m
            }
            var pre = '';
            if (count++ > 0 && realJson) pre = ',';
            send(pre + JSON.stringify(res) + '\n');
        }
    }
    if (realJson) send(']');
}

exports.lists = lists;

var views = {};

views.by_word = {
    map : function(doc) {
        if (!doc.tag) return;
        for (var i = 0; i < doc.tag.length; i++) {

            emit(doc.tag[i], null);
        };
    },
    reduce: '_count'
}

exports.views = views;