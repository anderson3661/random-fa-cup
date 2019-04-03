export const TESTING_MODE = false;
export const TESTING_EMAIL_ADDRESS = 'm@m.com';                             // Used in userReducer
export const TESTING_USER_ID_KEY = '_id';                                   // Used in userReducer              
export const TESTING_USER_ID = '5c7a2fb8f6f0801140ae065f';                  // Used in userReducer     

export const INCLUDE_MONGODB_OPTION = true;
export const INCLUDE_FIREBASE_OPTION = false;

export const HOSTING_SITE = "https://dashboard.heroku.com/apps/football-fa-cup-mern/deploy/github";
export const APP_TITLE = "Football - Random FA Cup - MERN";
export const MAIL_TO = "martin.anderson3661@gmail.com";
export const COPYRIGHT = "Martin Anderson 2019";

export const MAIN_BACKGROUND_IMAGE = require('../assets/images/football-stadium.jpg');
export const FOOTBALL_IMAGE = require('../assets/images/football.png');
export const WHITE_FOOTBALL_IMAGE = require('../assets/images/white-football.png');
export const WHITE_FOOTBALL_SMALL_IMAGE = require('../assets/images/white-football-small.png');
export const FA_CUP_IMAGE = require('../assets/images/fa-cup.png');
export const FA_CUP_SMALL_IMAGE = require('../assets/images/fa-cup-small.png');
export const SCARF_HELP = require('../assets/images/scarf-help.png');
export const SCARF_CONTACT = require('../assets/images/scarf-contact.png');
export const SCARF_ABOUT = require('../assets/images/scarf-about.png');
export const RED_CROSS = require('../assets/images/red-cross.png');

export const TEAMS_DEFAULT = [
    { premierLeague: [
        { teamName: "Arsenal", isATopTeam: true },
        { teamName: "Bournemouth", isATopTeam: false },
        { teamName: "Brighton", isATopTeam: false },
        { teamName: "Burnley", isATopTeam: false },
        { teamName: "Cardiff", isATopTeam: false },
        { teamName: "Chelsea", isATopTeam: true },
        { teamName: "Crystal Palace", isATopTeam: false },
        { teamName: "Everton", isATopTeam: false },
        { teamName: "Fulham", isATopTeam: false },
        { teamName: "Huddersfield", isATopTeam: false },
        { teamName: "Leicester", isATopTeam: false },
        { teamName: "Liverpool", isATopTeam: true },
        { teamName: "Manchester City", isATopTeam: true },
        { teamName: "Manchester United", isATopTeam: true },
        { teamName: "Newcastle", isATopTeam: false },
        { teamName: "Southampton", isATopTeam: false },
        { teamName: "Tottenham", isATopTeam: true },
        { teamName: "Watford", isATopTeam: false },
        { teamName: "West Ham", isATopTeam: false },
        { teamName: "Wolves", isATopTeam: false },
    ]},
    { championship: [
        { teamName: "Aston Villa", isATopTeam: false },
        { teamName: "Birmingham City", isATopTeam: false },
        { teamName: "Blackburn", isATopTeam: false },
        { teamName: "Bolton", isATopTeam: false },
        { teamName: "Brentford", isATopTeam: false },
        { teamName: "Bristol City", isATopTeam: true },
        { teamName: "Derby", isATopTeam: false },
        { teamName: "Hull", isATopTeam: false },
        { teamName: "Ipswich", isATopTeam: false },
        { teamName: "Leeds", isATopTeam: true },
        { teamName: "Middlesbrough", isATopTeam: true },
        { teamName: "Millwall", isATopTeam: false },
        { teamName: "Norwich", isATopTeam: true },
        { teamName: "Notts Forest", isATopTeam: false },
        { teamName: "Preston", isATopTeam: false },
        { teamName: "QPR", isATopTeam: false },
        { teamName: "Reading", isATopTeam: false },
        { teamName: "Rotherham", isATopTeam: false },
        { teamName: "Sheffield United", isATopTeam: true },
        { teamName: "Sheffield Wednesday", isATopTeam: false },
        { teamName: "Stoke", isATopTeam: false },
        { teamName: "Swansea", isATopTeam: false },
        { teamName: "West Brom", isATopTeam: true },
        { teamName: "Wigan", isATopTeam: false },
    ]},
    { leagueOne: [
        { teamName: "Accrington", isATopTeam: false },
        { teamName: "Barnsley", isATopTeam: true },
        { teamName: "Blackpool", isATopTeam: false },
        { teamName: "Bradford City", isATopTeam: false },
        { teamName: "Bristol Rovers", isATopTeam: false },
        { teamName: "Burton", isATopTeam: false },
        { teamName: "Charlton", isATopTeam: true },
        { teamName: "Coventry", isATopTeam: false },
        { teamName: "Doncaster", isATopTeam: true },
        { teamName: "Fleetwood", isATopTeam: false },
        { teamName: "Gillingham", isATopTeam: false },
        { teamName: "Luton", isATopTeam: true },
        { teamName: "Oxford", isATopTeam: false },
        { teamName: "Peterborough", isATopTeam: false },
        { teamName: "Portsmouth", isATopTeam: true },
        { teamName: "Plymouth", isATopTeam: false },
        { teamName: "Rochdale", isATopTeam: false },
        { teamName: "Scunthorpe", isATopTeam: false },
        { teamName: "Shrewsbury", isATopTeam: false },
        { teamName: "Southend", isATopTeam: false },
        { teamName: "Sunderland", isATopTeam: true },
        { teamName: "Walsall", isATopTeam: false },
        { teamName: "Wimbledon", isATopTeam: false },
        { teamName: "Wycombe", isATopTeam: false },
    ]},
    { leagueTwo: [
        { teamName: "Bury", isATopTeam: true },
        { teamName: "Cambridge", isATopTeam: false },
        { teamName: "Carlisle", isATopTeam: false },
        { teamName: "Cheltenham", isATopTeam: false },
        { teamName: "Colchester", isATopTeam: true },
        { teamName: "Crawley", isATopTeam: false },
        { teamName: "Crewe", isATopTeam: false },
        { teamName: "Exeter", isATopTeam: true },
        { teamName: "Forest Green", isATopTeam: false },
        { teamName: "Grimsby", isATopTeam: false },
        { teamName: "Lincoln", isATopTeam: true },
        { teamName: "Macclesfield", isATopTeam: false },
        { teamName: "Mansfield", isATopTeam: true },
        { teamName: "Milton Keynes", isATopTeam: true },
        { teamName: "Morecambe", isATopTeam: false },
        { teamName: "Newport", isATopTeam: false },
        { teamName: "Northampton", isATopTeam: false },
        { teamName: "Notts County", isATopTeam: false },
        { teamName: "Oldham", isATopTeam: false },
        { teamName: "Port Vale", isATopTeam: false },
        { teamName: "Stevenage", isATopTeam: false },
        { teamName: "Swindon", isATopTeam: false },
        { teamName: "Tranmere", isATopTeam: false },
        { teamName: "Yeovil", isATopTeam: false },
    ]},
    { nonLeague: [
        { teamName: "AFC Flyde", isATopTeam: true },
        { teamName: "Altrincham", isATopTeam: false },
        { teamName: "Barnet", isATopTeam: false },
        { teamName: "Barrow", isATopTeam: false },
        { teamName: "Bath", isATopTeam: false },
        { teamName: "Billericay", isATopTeam: false },
        { teamName: "Boreham Wood", isATopTeam: false },
        { teamName: "Brackley", isATopTeam: false },
        { teamName: "Bradford Park Avenue", isATopTeam: false },
        { teamName: "Bromley", isATopTeam: false },
        { teamName: "Chelmsford", isATopTeam: false },
        { teamName: "Chesterfield", isATopTeam: false },
        { teamName: "Chorley", isATopTeam: false },
        { teamName: "Dagenham & Redbridge", isATopTeam: false },
        { teamName: "Dartford", isATopTeam: false },
        { teamName: "Dover", isATopTeam: false },
        { teamName: "Eastleigh", isATopTeam: true },
        { teamName: "Ebbsfleet", isATopTeam: false },
        { teamName: "Gateshead", isATopTeam: false },
        { teamName: "Halifax", isATopTeam: false },
        { teamName: "Harrogate", isATopTeam: false },
        { teamName: "Hartlepool", isATopTeam: false },
        { teamName: "Lewes", isATopTeam: false },
        { teamName: "Maidenhead", isATopTeam: false },
        { teamName: "Orient", isATopTeam: true },
        { teamName: "Salford", isATopTeam: true },
        { teamName: "Spennymoor", isATopTeam: false },
        { teamName: "Solihull", isATopTeam: true },
        { teamName: "Stockport", isATopTeam: false },
        { teamName: "Sutton", isATopTeam: false },
        { teamName: "Telford", isATopTeam: false },
        { teamName: "Torquay", isATopTeam: false },
        { teamName: "Welling", isATopTeam: false },
        { teamName: "Woking", isATopTeam: false },
        { teamName: "Worthing", isATopTeam: false },
        { teamName: "Wrexham", isATopTeam: true },
    ]},
]

export const DEFAULT_VALUE_SEASON = "2018/19";
export const DEFAULT_VALUE_COMPETITION_START_DATE = "8 Dec 2018";
export const DEFAULT_VALUE_COMPETITION_START_TIME = "15:00";
export const DEFAULT_VALUE_FIXTURE_UPDATE_INTERVAL = 1;
export const DEFAULT_VALUE_BASE_FOR_RANDOM_MULTIPLIER = 90;
export const DEFAULT_VALUE_AWAY_TEAM_FACTOR = 1.25;
export const DEFAULT_VALUE_DIVISION_FACTOR = 1.25;
export const DEFAULT_VALUE_IS_NOT_A_TOP_TEAM_FACTOR = 1.25;
export const DEFAULT_VALUE_GOALS_PER_MINUTE_FACTOR = [{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 140, 'factor': 1}];
export const DEFAULT_VALUE_IS_IT_A_GOAL_FACTOR = 2;
export const DEFAULT_VALUE_IS_IT_A_GOAL_FROM_A_PENALTY_FACTOR = 80;

export const SEASON = 'season';
export const COMPETITION_START_DATE = 'competitionStartDate';
export const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';
export const BASE_FOR_RANDOM_MULTIPLIER = 'baseForRandomMultiplier';
export const AWAY_TEAM_FACTOR = 'isAwayTeam';
export const IS_NOT_A_TOP_TEAM_FACTOR = 'isNotATopTeam';
export const DIVISION_FACTOR = 'divisionFactor';
export const GOALS_PER_MINUTE_FACTOR = 'likelihoodOfAGoalDuringASetPeriod';
export const IS_IT_A_GOAL_FACTOR = 'isItAGoal';
export const IS_IT_A_GOAL_PENALTY_FACTOR = 'isItAGoalFromAPenalty';
export const HAVE_SEASONS_FIXTURES_BEEN_CREATED = 'haveSeasonsFixturesBeenCreated';

export const API_ENDPOINT_USERS = '/api/users';
export const API_ENDPOINT_MISCELLANEOUS = '/api/miscellaneous';
export const API_ENDPOINT_SETTINGS_FACTORS = '/api/settings-factors';
export const API_ENDPOINT_TEAMS = '/api/teams';
export const API_ENDPOINT_MY_WATCHLIST_TEAMS = '/api/my-watchlist-teams';
export const API_ENDPOINT_FIXTURES = '/api/fixtures';

export const API_ENDPOINTS_TO_LOAD_ALL_DATA = [
    API_ENDPOINT_MISCELLANEOUS,
    API_ENDPOINT_SETTINGS_FACTORS,
    API_ENDPOINT_TEAMS,
    API_ENDPOINT_MY_WATCHLIST_TEAMS,
    API_ENDPOINT_FIXTURES, 
]

export const API_ENDPOINTS_TO_DELETE_ALL_DATA = [
    API_ENDPOINT_MISCELLANEOUS,
    API_ENDPOINT_SETTINGS_FACTORS,
    API_ENDPOINT_TEAMS,
    API_ENDPOINT_FIXTURES, 
]

export const API_ENDPOINTS_TO_DELETE_KEEP_CURRENT_SETTINGS = [
    API_ENDPOINT_MISCELLANEOUS,
    API_ENDPOINT_FIXTURES, 
]

export const FIXTURES_DEFAULT = [
    { round1Fixtures: [], round1Replays: [], replaysAllowed: true },
    { round2Fixtures: [], round2Replays: [], replaysAllowed: true },
    { round3Fixtures: [], round3Replays: [], replaysAllowed: true },
    { round4Fixtures: [], round4Replays: [], replaysAllowed: true },
    { quarterFinalFixtures: [], quarterFinalReplays: [], replaysAllowed: true },
    { semiFinalFixtures: [], replaysAllowed: false },
    { finalFixtures: [], replaysAllowed: false },
]

export const NUMBER_OF_TEAMS = 128;

export const PREMIER_LEAGUE = 'premierLeague';
export const DIVISIONS = ['premierLeague', 'championship', 'leagueOne', 'leagueTwo', 'nonLeague'];
export const DIVISIONS_HEADINGS = ['Premier League', 'Championship', 'League One', 'League Two', 'Non-League'];
export const DIVISIONS_ABBREVIATIONS = ['PL', 'C', 'L1', 'L2', 'NL'];

export const COMPETITION_ROUNDS = ['1st-round', '2nd-round', '3rd-round', '4th-round', 'quarter-finals', 'semi-finals', 'final'];
export const COMPETITION_ROUNDS_FOR_CSS = ['first-round', 'second-round', 'third-round', 'fourth-round', 'quarter-finals', 'semi-finals', 'final'];
export const COMPETITION_ROUNDS_HEADINGS = ['1st Round', '2nd Round', '3rd Round', '4th Round', 'Quarter Finals', 'Semi Finals', 'Final'];
export const COMPETITION_ROUNDS_HEADINGS_ABBREVIATED = ['R1', 'R2', 'R3', 'R4', 'QF', 'SF', 'Final'];
export const COMPETITION_ROUNDS_FIXTURES = ['round1', 'round2', 'round3', 'round4', 'quarterFinal', 'semiFinal', 'final'];
export const FIRST_ROUND = '1st-round';
export const SECOND_ROUND = '2nd-round';
export const THIRD_ROUND = '3rd-round';
export const FOURTH_ROUND = '4th-round';
export const QUARTER_FINALS = 'quarter-finals';
export const SEMI_FINALS = 'semi-finals';
export const FINAL = 'final';

export const IS_FIXTURES = false;
export const IS_REPLAYS = true;

export const EXTRA_MINUTES_FIRST_HALF = 5;
export const EXTRA_MINUTES_SECOND_HALF = 9;
export const EXTRA_MINUTES_EXTRA_TIME_FIRST_HALF = 2;
export const EXTRA_MINUTES_EXTRA_TIME_SECOND_HALF = 3;

export const START_FIXTURES = "Start Fixtures";
export const START_SECOND_HALF = "Start Second Half";
export const PAUSE_FIXTURES = "Pause Fixtures";
export const CONTINUE_FIXTURES = "Continue Fixtures";
export const START_EXTRA_TIME = "Start Extra Time";
export const START_EXTRA_TIME_SECOND_HALF = "Start ET Second Half";
export const PAUSE_EXTRA_TIME = "Pause Extra Time";
export const CONTINUE_EXTRA_TIME = "Continue Extra Time";
export const START_PENALTIES = "Start Penalties";
export const PAUSE_PENALTIES = "Pause Penalties";
export const CONTINUE_PENALTIES = "Continue Penalties";
export const FIXTURES_FINISHED = "Fixtures Finished";

export const HALF_TIME = "Half-Time";
export const HALF_TIME_IN_EXTRA_TIME = "Half-Time (ET)";
export const FULL_TIME = "Full-Time";
export const FULL_TIME_AFTER_90_MINUTES = "Full-Time (90)";
export const FULL_TIME_AFTER_EXTRA_TIME = "Full-Time (AET)";
export const FULL_TIME_AFTER_PENALTIES = "Full-Time (pens)";

export const RESET_APP_CONFIRM_NO = 'No';
export const RESET_APP_KEEP_CURRENT_SETTINGS = 'Keep Current Settings';
export const RESET_APP_USE_SYSTEM_DEFAULTS = 'Use System Defaults';

export const REDIRECT_TO_HOME = '/home';
export const REDIRECT_TO_SETTINGS = '/settings';
