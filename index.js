var Synchronizer = require('./libs/synchronizer.js');
var github = require('./libs/github.js');

new Synchronizer('en').sync();
new Synchronizer('zh_CN').sync();
new Synchronizer('zh_TW').sync();