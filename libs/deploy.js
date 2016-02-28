var exec = require('child_process').exec;

exec('git add -A', function(err, stdout, stderr){
	exec('git commit -m "update site at ' + new Date + '"' ,function(err, stdout, stderr){
		exec('git push origin gh-pages',function(err, stdout, stderr){
		})
	});
});
console.log('start deploy to github...')