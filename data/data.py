import requests, os

API_VERSION = '00'
OUTPUT_FOLDER = '2012' # tweak as needed

API_PATH = "http://www.gannett-cdn.com/ElectionsServices/Elections/{0}/".format(API_VERSION)
ROOT_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), OUTPUT_FOLDER, API_VERSION) 


def lookup(path, os_path):
	response = requests.get(path)
	if response.ok:
		print '# found ', path, os_path
		with open(os_path, 'w') as f:
			f.truncate()
			f.write(response.content)
			f.close()
	else:
		print '#### ERROR: ', path


# http://www.gannett-cdn.com/ElectionsServices/Elections/00/RaceResultsByState/g?callback=cb_0_00RaceResultsByStateg
print '... Race Results ...'
RR_By_State = "RaceResultsByState/{type}?callback=cb_0_00RaceResultsByState{type}"
RR_Types = ['g', 's', 'h']
RR_Dir = os.path.join(ROOT_DIR, 'ResultsByState')

if os.path.exists(RR_Dir):
	print RR_Dir, ' already exists ...'
else:
	os.makedirs(RR_Dir)

	for race_type in RR_Types:
		os_path = os.path.join(RR_Dir, race_type)
		lookup("{0}{1}".format(API_PATH, RR_By_State.format(type=race_type)), os_path)


# http://www.gannett-cdn.com/ElectionsServices/Elections/00/AllRaces?callback=cb_0_00AllRaces
print '... All Races ...'
lookup("{0}{1}".format(API_PATH, "AllRaces?callback=cb_0_00AllRaces"), os.path.join(ROOT_DIR, 'AllRaces'))

# http://www.gannett-cdn.com/ElectionsServices/Elections/00/BallotInitiativesByState?callback=cb_0_00BallotInitiativesByState
print '... Ballot Initiatives By State ...'
lookup("{0}{1}".format(API_PATH, "BallotInitiativesByState?callback=cb_0_00BallotInitiativesByState"), os.path.join(ROOT_DIR, 'BallotInitiativesByState'))


# http://www.gannett-cdn.com/ElectionsServices/Elections/00/StateBallotInitiatives/30?callback=cb_586_00StateBallotInitiatives30
# print '... Ballot Initiatives ...'
# SBI = "StateBallotInitiatives/{ballot_id}?callback=cb_586_00StateBallotInitiatives{ballot_id}"
# SBI_IDS = ["56","42","39","35","24","44","41","55","38","32","13","36","05","20","31","49","02","28","40","54","26","08","34","10","30","53","09","06","21","25","12","16","29","15","01","45","33","46","17","47","18","19","04","27","22","11","51","48","50","23","37"]
# SBI_Dir = os.path.join(ROOT_DIR, 'StateBallotInitiatives')

# if os.path.exists(SBI_Dir):
# 	print SBI_Dir, ' already exists ...'
# else:
# 	os.makedirs(SBI_Dir)

# 	for ids in SBI_IDS:
# 		os_path = os.path.join(SBI_Dir, str(ids))
# 		lookup("{0}{1}".format(API_PATH, SBI.format(ballot_id=ids)), os_path)
