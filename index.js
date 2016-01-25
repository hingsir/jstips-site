var parse = require('./libs/parse.js');
var github = require('./libs/github.js');

github.request('/repos/loverajoel/jstips/contents/_posts/en',function(data){
    parse.parse(data);
})