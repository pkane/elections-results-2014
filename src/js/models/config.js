define([], function () {

    return {
        
        api: {
            base: 'http://www.gannett-cdn.com/ElectionsServices/Elections/',
            dataFeedVersionId: 0,
            lastChecked: 0,
            pollFrequency: 5 * 60 * 1000, // TBD
            op: {
                version: 'CurrentVersion',
                all: '{dataFeedVersionId}/AllRaces',
                initiatives: '{dataFeedVersionId}/BallotInitiativesByState',
                raceByState: '{dataFeedVersionId}/RaceResultsByState/{raceId}',
                raceByCounty: '{dataFeedVersionId}/StateResultsByCountyOrCd/{raceId}/{stateId}'
            }
        },
        
        races: [
            { id: 'h', key: 'house', display: 'House', op: 'raceByCounty'},
            { id: 's', key: 'senate', display: 'Senate', op: 'raceByState', detail: 'raceByCounty'},
            { id: 'g', key: 'governors', display: 'Governors', op: 'raceByState', detail: 'raceByCounty'},
            { id: 'i', key: 'initiatives', display: 'Initiatives', op: 'initiatives'},
            { id: 's', key: 'summary', op: 'all'}
        ],
        
        states: [
            { id: '01', abbr: 'al', display: 'Alabama'},
            { id: '02', abbr: 'ak', display: 'Alaska'},
            { id: '04', abbr: 'az', display: 'Arizona'},
            { id: '05', abbr: 'ar', display: 'Arkansas'},
            { id: '06', abbr: 'ca', display: 'California'},
            { id: '08', abbr: 'co', display: 'Colorado'},
            { id: '09', abbr: 'ct', display: 'Connecticut'},
            { id: '10', abbr: 'de', display: 'Delaware'},
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
        ]
        // {'id': '11', abbr: 'dc', display: 'District of Columbia'
    };

});