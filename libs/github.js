var https = require('https');

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
        options.path += '?access_token=a99563d8bf47fb6f995d5abc661c2dc383243f81';
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