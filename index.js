var Synchronizer = require('./libs/synchronizer.js');
var github = require('./libs/github.js');
var config = require('./config.js');

for(var lang in config.languages){
	new Synchronizer(lang).sync();
}
