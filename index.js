var sync = require('./libs/sync.js');
var github = require('./libs/github.js');

github.request('/repos/loverajoel/jstips/contents/_posts/en',function(data){
    sync.sync(data);
})