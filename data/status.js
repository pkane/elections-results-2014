// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/CurrentVersion?callback=ping&api_key=mwpprad6j3da5u34cnt7prnh

var http = require('http'),
	request = require('request'),
	fs = require('fs')
	;

var config = {	
	key: 'api_key=mwpprad6j3da5u34cnt7prnh',
	service: 'ElectionsServices/Elections/',
	base: {
		'api.gannett-cdn.com': 	{name: 'exter akamai', root: '/internal' },
		
		'159.54.244.117': 		{name: 'external moc'},
		'209.97.52.193': 		{name: 'external phx'},

		'159.54.243.12': 		{name: ' varnish moc'},
		'209.97.52.118': 		{name: ' varnish phx'},

		'10.189.4.131': 		{name: 'internal moc'},
		'10.186.4.133': 		{name: 'internal phx'}

	},	
	allRaces: '2014/AllRaces',
	currentVersion: 'CurrentVersion'

};

var d = new Date(),
	rootFolder = 'status-' + d.getFullYear() + (d.getMonth() + 1) + d.getDate(),
	queue = []
	;

if (!fs.existsSync(rootFolder))
	fs.mkdirSync(rootFolder);

var fd = fs.openSync(rootFolder + '/' + d.toJSON(), 'w+');

function done() {
	console.log('......')
	fs.close(fd);	
}

function allRaces(text) {

	var response = '\n', json = JSON.parse(text);

	json.forEach(function(o) {
		response += o.id;

		o.results.forEach(function(r) {
			response += '\t' + r.party + '\t' + r.seats + '\t' + r.change + '\t' + r.win;
		});

		response += '\n';
	});

	return response;
}


function dequeue() {

	if (queue.length > 0) {

		request(queue.shift(), function (error, response, body) {

			var base = config.base[response.request.originalHost],
				req = response.request
				;

			if (!error && response.statusCode == 200) {
				if (req.href.indexOf(config.allRaces) !== -1) {
					console.log(base.name, allRaces(body));
					fs.writeSync(fd, base.name + ' ' + allRaces(body));
				} else {
					console.log(base.name, body);
					fs.writeSync(fd, base.name + ' ' + body);
				}

				fs.writeSync(fd, '\n');
			    	
			} else {
				console.log('error ', error);
			}

			queue.length > 0 ? dequeue() : done();

		});

	}

}

// dequeue();

console.log('\n# ', (new Date()).toTimeString());

[config.currentVersion, config.allRaces].forEach(function(f) {

	Object.keys(config.base).forEach(function(b) {

		var base = config.base[b], 
			path = 'http://' + b + (base.root || '') + '/' + config.service + f + '?' + config.key
			;

			queue.push(path);
	});

});

dequeue();

