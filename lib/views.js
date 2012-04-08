exports.by_word = {
    map : function(doc) {
        if (!doc.tag) return;
        for (var i = 0; i < doc.tag.length; i++) {

            emit(doc.tag[i], null);
        };
    },
    reduce: '_count'
}