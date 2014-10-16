// NodeJS Backup of Race Results 2014
// run: node backup.js
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

    folders: [
        'DataFeedVersions',
        '2014',
        '2014/RaceResultsByState',
        '2014/StateResultsByCountyOrCd',
        '2014/StateResultsByCountyOrCd/h',
        '2014/StateResultsByCountyOrCdDetail',
        '2014/StateResultsByCountyOrCdDetail/s',
        '2014/StateResultsByCountyOrCdDetail/h',
        '2014/StateResultsByCountyOrCdDetail/g'
    ],

    // http://localhost:8000/1413399298765/2014/StateResultsByCountyOrCd/h/00?callback=usat_2raceByCounty&api_key=mwpprad6j3da5u34cnt7prnh

    feeds: [
    	{ fileName: 'CurrentVersion', folderPath: '/', apiPath: 'CurrentVersion', callback: 'ping' },
    	{ fileName: 'AllRaces', folderPath: '2014/', apiPath: '2014/AllRaces', callback: 'usat_2all' },
    	{ fileName: 's', folderPath: '2014/RaceResultsByState/', apiPath: '2014/RaceResultsByState/s', callback: 'usat_2raceByState' },
    	{ fileName: 'h', folderPath: '2014/RaceResultsByState/', apiPath: '2014/RaceResultsByState/h', callback: 'usat_2raceByState' },
    	{ fileName: 'g', folderPath: '2014/RaceResultsByState/', apiPath: '2014/RaceResultsByState/g', callback: 'usat_2raceByState' },
        { fileName: '00', folderPath: '2014/StateResultsByCountyOrCd/h/', apiPath: '2014/StateResultsByCountyOrCd/h/00', callback: 'usat_2raceByCounty' },
        { fileName: 'BallotInitiativesByState', folderPath: '2014/', apiPath: '2014/BallotInitiativesByState', callback: 'usat_2initiatives' },
    	{ fileName: '2014', folderPath: 'DataFeedVersions/', apiPath: 'DataFeedVersions/2014', callback: 'usat_2updates' }    	
    ],

    detailFeeds: [
    	{ fileName: '', folderPath: '2014/StateResultsByCountyOrCdDetail/s/', apiPath: '2014/StateResultsByCountyOrCdDetail/s/', callback: 'usat_2raceByCountyDetail' },
    	{ fileName: '', folderPath: '2014/StateResultsByCountyOrCdDetail/h/', apiPath: '2014/StateResultsByCountyOrCdDetail/h/', callback: 'usat_2raceByCountyDetail' },
    	{ fileName: '', folderPath: '2014/StateResultsByCountyOrCdDetail/g/', apiPath: '2014/StateResultsByCountyOrCdDetail/g/', callback: 'usat_2raceByCountyDetail' }
    ]

};

var args = process.argv.slice(2),
    rootFolder = '' + (args[0] ? args[0] : Date.now())
    ;

// libs
function api_request(opt) {
	
    var path = config.base + opt.folderPath + opt.fileName + '?callback=' + opt.callback + '&' + config.key;

    console.log('request ... ', path);

	http.get(path, function(response) {

		var text = '';

		response.on('data', function (chunk) {
			text += chunk;
		});

		response.on('end', function () {

			console.log('received ... ', opt.folderPath, opt.fileName);

            var fd = fs.openSync(rootFolder + '/' + opt.folderPath + opt.fileName, 'w+');

            fs.writeSync(fd, text);

		});

	});
}

// main
fs.mkdir(rootFolder, function(rep) {

    console.log('make dir ', rootFolder);

    // create folder paths
    config.folders.forEach(function(folderPath) {
        fs.mkdirSync(rootFolder + '/' + folderPath);
    });

    // national feeds
    config.feeds.forEach(function(opt) {
        api_request(opt);
    });

    // detail feeds
    config.detailFeeds.forEach(function(item) {

        config.states.forEach(function(state) {

            api_request({
                fileName: item.fileName + state.id,
                folderPath: item.folderPath,
                apiPath: item.apiPath + state.id,
                callback: item.callback
            });

        });

    });

});
