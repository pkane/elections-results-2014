Elections Results 2014
----

#### URL Structure
/elections-results-2014/   
/elections-results-2014/#/{house|senate|governors}/{embed}  
/elections-results-2014/#/{al-wy}/{embed}  
/elections-results-2014/#/race/{house|senate|governors}-{al-wy|al-wy + fip}/{embed}   

#### Development Env Setup
Install Node dependencies: ```npm install```

Install JS Libs: ```bower install```

Run development server: ```grunt serve```

Release Build: ```grunt```


#### Debatably Useful Information
[What is Fips](http://en.wikipedia.org/wiki/Federal_Information_Processing_Standards)



#### API Help Page
[http://www.gannett-cdn.com/ElectionsServices/Elections/help](http://www.gannett-cdn.com/ElectionsServices/Elections/help)
<pre>
/{dataFeedVersionId}/AllRaces
/{dataFeedVersionId}/BallotInitiativesByState
/{dataFeedVersionId}/PredictionFeed
/{dataFeedVersionId}/RaceResultsByState/{raceId}
/{dataFeedVersionId}/StateBallotInitiatives/{stateFips}
/{dataFeedVersionId}/StateResultsByCountyOrCd/{raceId}/{stateFips}
/{dataFeedVersionId}/StateResultsByCountyOrCdDetail/{raceId}/{stateFips}
/CurrentVersion
/DataFeedVersions/{versionsToDisplay}
/Mobile/AllRaces
/Mobile/HouseResults/
/Mobile/RaceResultsByState/{raceId}
/WebServiceVersion
</pre>  




#### API Examples w/ JSONP callback



##### Current Version
[http://www.gannett-cdn.com/ElectionsServices/Elections/CurrentVersion?time=46968955&callback=cb_586_CurrentVersion](http://www.gannett-cdn.com/ElectionsServices/Elections/CurrentVersion?time=46968955&callback=cb_586_CurrentVersion)


##### DataFeed Versions
[http://www.gannett-cdn.com/ElectionsServices/Elections/DataFeedVersions/00?callback=cb_0_DataFeedVersions00](http://www.gannett-cdn.com/ElectionsServices/Elections/DataFeedVersions/00?callback=cb_0_DataFeedVersions00)


##### All Races
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/AllRaces?callback=cb_0_00AllRaces](http://www.gannett-cdn.com/ElectionsServices/Elections/00/AllRaces?callback=cb_0_00AllRaces)


##### State Results By County or CD
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/StateResultsByCountyOrCd/h/00?callback=cb_0_00StateResultsByCountyOrCdh00](http://www.gannett-cdn.com/ElectionsServices/Elections/00/StateResultsByCountyOrCd/h/00?callback=cb_0_00StateResultsByCountyOrCdh00)


##### Race Results by State (Governor)
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/g?callback=cb_0_00RaceResultsByStateg](http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/g?callback=cb_0_00RaceResultsByStateg)


##### Race Results by State (Senate)
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/s?callback=cb_0_00RaceResultsByStates](http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/s?callback=cb_0_00RaceResultsByStates)

##### Race Results by State (House)
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/h?callback=cb_0_00RaceResultsByStateh](http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/h?callback=cb_0_00RaceResultsByStateh)


##### Ballot Initiatives
[http://www.gannett-cdn.com/ElectionsServices/Elections/00/StateBallotInitiatives/30?callback=cb_586_00StateBallotInitiatives30](http://www.gannett-cdn.com/ElectionsServices/Elections/00/StateBallotInitiatives/30?callback=cb_586_00StateBallotInitiatives30)


