var https = require('https');
var parse = require('./libs/parse.js')

var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/loverajoel/jstips/readme',
    headers: {
        'User-Agent': 'test'
    }
}

https.get(options,function(res){
    var data = ''
    res.on('data',function(chunk){
        data += chunk;
    })
    res.once('end',function(){
        var content = new Buffer(JSON.parse(data).content,'base64');
        parse.parse(content.toString());
    })
})