var exec = require('child_process').exec;

exec('git add -A', function(err, stdout, stderr){
	if(err) throw err;
	console.log(stdout);
	exec('git commit -m "Update site at ' + new Date + '"' ,function(err, stdout, stderr){
		if(err) throw err;
		console.log(stdout);
		exec('git push origin gh-pages',function(err, stdout, stderr){
			if(err) throw err;
			console.log(stdout);
		})
	});
});
