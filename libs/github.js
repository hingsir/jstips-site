var https = require('https');
var config = require('../config.js');

var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/loverajoel/jstips/contents/_posts/en',
    headers: {
        'User-Agent': 'test'
    }
}

module.exports = {
    request: function(path, callback){
        options.path = path || options.path;
        config.git_access_token && (options.path += '?access_token=' + config.git_access_token);
        https.get(options,function(res){
            var data = '';
            res.on('data',function(chunk){
                data += chunk;
            })
            res.once('end',function(){
                callback && callback(data);
            })
        })
    }
}
