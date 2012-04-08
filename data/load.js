var csv = require('csv');
var natural = require('natural'),
  tokenizer = new natural.WordTokenizer();
var NGrams = natural.NGrams;

var nano = require('nano')('http://localhost:5984');
var db_name = 'tpb';
var db = nano.use(db_name);
var _ = require('underscore')._;


csv().fromPath(__dirname+'/complete', {
	delimiter : '|'	,
        quote : 'ǫ'

})
.on('data', function(data, index) {
   var row = {
       _id : data[0],
       name : data[1],
       size : data[2],
       s: Number(data[3]),
       l: Number(data[4]),
       m: data[5]
   };
   // only add active torrents (my pref)
   if (row.s == 0) return;

   row.tag = _.map(tokenizer.tokenize(row.name), function(token){return token.toLowerCase()});
   row.tag = _.reject(row.tag, function(tag) {
        if (tag.length === 1) return true;
        if (tag.indexOf('_') >= 0) return true;
       return false;
   });
   insert_row(row);


})
.on('error', function(error) {
	console.log('error: ' + error);
});

var buffer = [];
var warming = false;
var warmer = 0;

function insert_row(row) {
    if (buffer.length < 500) {
        buffer.push(row);
    }
    else {
        console.log('bulk insert');
        db.bulk({ "docs" : buffer}, {}, function(err, resp) {
            if (warmer++ > 100 & !warming) {
                warming = true;
                setTimeout(warmView, 10);
                warmer = 0;
            }
        });
        buffer = [];
    }
}

function warmView() {
    console.log('start warm');
    db.view('couch-pirate', 'by_word', {stale : 'update_after'}, function(err, resp) {
        console.log('view warmed', err, resp);
        warming = false;
    })
}
