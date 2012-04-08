module.exports = [
    {from: '/modules.js', to: 'modules.js'},
    {from: '/bootstrap/*', to: '/bootstrap/*'},
    {from: '/', to: 'html/index.html'},
    {from: '/_search/:key', to: '../couch-pirate/_list/intersection/by_word',  query: {include_docs : 'true', reduce: 'false', key: ':key' } },
    {from: '/_search/:key/:extra_keys', to: '../couch-pirate/_list/intersection/by_word',  query: {include_docs : 'true', reduce: 'false', key: ':key', extra_keys : ':extra_keys' } },
    {from: '/_db/*', to : '../../*'},
    {from: '/_db', to : '../../'},
    {from: '/*', to: 'html/*'},

];