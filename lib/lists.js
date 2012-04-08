var _ = require('underscore')._;

exports.id_only = function(head, req) {
   start({'headers' : {'Content-Type' : 'text/text'}});
   var row;
   while ((row = getRow())) {
       emit(row.key, '\n');
   }
}

exports.intersection = function (head, req) {

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