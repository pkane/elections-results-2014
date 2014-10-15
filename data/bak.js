// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/CurrentVersion?callback=ping&api_key=mwpprad6j3da5u34cnt7prnh
// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/2014/AllRaces?callback=usat_2all&api_key=mwpprad6j3da5u34cnt7prnh
// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/2014/RaceResultsByState/s?callback=usat_2raceByState&api_key=mwpprad6j3da5u34cnt7prnh
// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/DataFeedVersions/2014?callback=usat_2updates&api_key=mwpprad6j3da5u34cnt7prnh
// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/2014/StateResultsByCountyOrCdDetail/s/46?callback=usat_2raceByCountyDetail&api_key=mwpprad6j3da5u34cnt7prnh
// http://api.gannett-cdn.com/internal/ElectionsServices/Elections/2014/StateResultsByCountyOrCdDetail/s/30?callback=usat_2raceByCountyDetail&api_key=mwpprad6j3da5u34cnt7prnh


var http = require('http'),
	fs = require('fs')
	;

var config = {

	base: 'http://api.gannett-cdn.com/internal/ElectionsServices/Elections/',
    key: 'api_key=mwpprad6j3da5u34cnt7prnh',
    states: [
        { id: '01', abbr: 'al', display: 'Alabama'},
        { id: '02', abbr: 'ak', display: 'Alaska'},
        { id: '04', abbr: 'az', display: 'Arizona'},
        { id: '05', abbr: 'ar', display: 'Arkansas'},
        { id: '06', abbr: 'ca', display: 'California'},
        { id: '08', abbr: 'co', display: 'Colorado'},
        { id: '09', abbr: 'ct', display: 'Connecticut'},
        { id: '10', abbr: 'de', display: 'Delaware'},
        { id: '11', abbr: 'dc', display: 'District of Columbia'},
        { id: '12', abbr: 'fl', display: 'Florida'},
        { id: '13', abbr: 'ga', display: 'Georgia'},
        { id: '15', abbr: 'hi', display: 'Hawaii'},
        { id: '16', abbr: 'id', display: 'Idaho'},
        { id: '17', abbr: 'il', display: 'Illinois'},
        { id: '18', abbr: 'in', display: 'Indiana'},
        { id: '19', abbr: 'ia', display: 'Iowa'},
        { id: '20', abbr: 'ks', display: 'Kansas'},
        { id: '21', abbr: 'ky', display: 'Kentucky'},
        { id: '22', abbr: 'la', display: 'Louisiana'},
        { id: '23', abbr: 'me', display: 'Maine'},
        { id: '24', abbr: 'md', display: 'Maryland'},
        { id: '25', abbr: 'ma', display: 'Massachusetts'},
        { id: '26', abbr: 'mi', display: 'Michigan'},
        { id: '27', abbr: 'mn', display: 'Minnesota'},
        { id: '28', abbr: 'ms', display: 'Mississippi'},
        { id: '29', abbr: 'mo', display: 'Missouri'},
        { id: '30', abbr: 'mt', display: 'Montana'},
        { id: '31', abbr: 'ne', display: 'Nebraska'},
        { id: '32', abbr: 'nv', display: 'Nevada'},
        { id: '33', abbr: 'nh', display: 'New Hampshire'},
        { id: '34', abbr: 'nj', display: 'New Jersey'},
        { id: '35', abbr: 'nm', display: 'New Mexico'},
        { id: '36', abbr: 'ny', display: 'New York'},
        { id: '37', abbr: 'nc', display: 'North Carolina'},
        { id: '38', abbr: 'nd', display: 'North Dakota'},
        { id: '39', abbr: 'oh', display: 'Ohio'},
        { id: '40', abbr: 'ok', display: 'Oklahoma'},
        { id: '41', abbr: 'or', display: 'Oregon'},
        { id: '42', abbr: 'pa', display: 'Pennsylvania'},
        { id: '44', abbr: 'ri', display: 'Rhode Island'},
        { id: '45', abbr: 'sc', display: 'South Carolina'},
        { id: '46', abbr: 'sd', display: 'South Dakota'},
        { id: '47', abbr: 'tn', display: 'Tennessee'},
        { id: '48', abbr: 'tx', display: 'Texas'},
        { id: '49', abbr: 'ut', display: 'Utah'},
        { id: '50', abbr: 'vt', display: 'Vermont'},
        { id: '51', abbr: 'va', display: 'Virginia'},
        { id: '53', abbr: 'wa', display: 'Washington'},
        { id: '54', abbr: 'wv', display: 'West Virginia'},
        { id: '55', abbr: 'wi', display: 'Wisconsin'},
        { id: '56', abbr: 'wy', display: 'Wyoming'}
    ],
    raceFeeds: [
    	{ filePath: 'CurrentVersion', apiPath: 'CurrentVersion', callback: 'ping' },
    	{ filePath: '2014/AllRaces', apiPath: '2014/AllRaces', callback: 'usat_2all' },
    	{ filePath: '2014/RaceResultsByState/s', apiPath: '2014/RaceResultsByState/s', callback: 'usat_2raceByState' },
    	{ filePath: '2014/RaceResultsByState/h', apiPath: '2014/RaceResultsByState/h', callback: 'usat_2raceByState' },
    	{ filePath: '2014/RaceResultsByState/g', apiPath: '2014/RaceResultsByState/g', callback: 'usat_2raceByState' },
    	{ filePath: 'DataFeedVersions/2014', apiPath: 'DataFeedVersions/2014', callback: 'usat_2updates' }    	
    ],

    stateFeeds: [
    	{ filePath: '2014/StateResultsByCountyOrCdDetail/s/{state_id}', apiPath: '2014/StateResultsByCountyOrCdDetail/s/{state_id}', callback: 'usat_2raceByCountyDetail' },
    	{ filePath: '2014/StateResultsByCountyOrCdDetail/h/{state_id}', apiPath: '2014/StateResultsByCountyOrCdDetail/h/{state_id}', callback: 'usat_2raceByCountyDetail' },
    	{ filePath: '2014/StateResultsByCountyOrCdDetail/g/{state_id}', apiPath: '2014/StateResultsByCountyOrCdDetail/g/{state_id}', callback: 'usat_2raceByCountyDetail' }
    ]

};

// libs
function request(opt) {
	
	http.get(config.base + opt.apiPath + '?callback=' + opt.callback + '&' + config.key, function(response) {

		var text = '';

		response.on('data', function (chunk) {
			text += chunk;
		});

		response.on('end', function () {

			console.log('received ... ', opt.apiPath);

			// console.log(text);
		});

	});
}

// main



config.raceFeeds.forEach(function(item) {

	request(item);

});

config.stateFeeds.forEach(function(item) {

	config.states.forEach(function(state) {

		request({ filePath: item.filePath.replace("{state_id}", state.id), apiPath: item.apiPath.replace("{state_id}", state.id), callback: item.callback });

	});

});

