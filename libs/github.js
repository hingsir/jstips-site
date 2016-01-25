var https = require('https');

var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/loverajoel/jstips/contents/_posts/en',
    headers: {
        'User-Agent': 'test'
    },
    auth:'hingsir1024@gmail.com'
}

module.exports = {
    request: function(path, callback){
        options.path = path || options.path;
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