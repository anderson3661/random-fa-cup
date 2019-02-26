export const TESTING_MODE = false;

export const INCLUDE_MONGODB_OPTION = true;
export const INCLUDE_FIREBASE_OPTION = false;

export const HOSTING_SITE = "https://console.firebase.google.com/u/0/project/football-b1017/hosting/main";
export const APP_TITLE = "Football - Premier League";
export const MAIL_TO = "martin.anderson3661@gmail.com";

export const MAIN_BACKGROUND_IMAGE = require('../assets/images/football3.jpg');
export const FOOTBALL_IMAGE = require('../assets/images/football.png');

export const TEAMS_DEFAULT = [
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
    { teamName: "Wolves", isATopTeam: false }
]

export const DEFAULT_VALUE_SEASON = "2018/19";
export const DEFAULT_VALUE_SEASON_START_DATE = "11 Aug 2018";
export const DEFAULT_VALUE_NUMBER_OF_FIXTURES_FOR_SEASON = 10;
export const DEFAULT_VALUE_FIXTURE_UPDATE_INTERVAL = 0.25;
export const DEFAULT_VALUE_BASE_FOR_RANDOM_MULTIPLIER = 90;
export const DEFAULT_VALUE_AWAY_TEAM_FACTOR = 1.1;
export const DEFAULT_VALUE_IS_NOT_A_TOP_TEAM_FACTOR = 1.1;
export const DEFAULT_VALUE_GOALS_PER_MINUTE_FACTOR = [{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 120, 'factor': 1}];
export const DEFAULT_VALUE_IS_IT_A_GOAL_FACTOR = 2;

export const SEASON = 'season';
export const SEASON_START_DATE = 'seasonStartDate';
export const NUMBER_OF_FIXTURES_FOR_SEASON = 'numberOfFixturesForSeason';
export const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';
export const BASE_FOR_RANDOM_MULTIPLIER = 'baseForRandomMultiplier';
export const AWAY_TEAM_FACTOR = 'isAwayTeam';
export const IS_NOT_A_TOP_TEAM_FACTOR = 'isNotATopTeam';
export const GOALS_PER_MINUTE_FACTOR = 'likelihoodOfAGoalDuringASetPeriod';
export const IS_IT_A_GOAL_FACTOR = 'isItAGoal';
export const HAVE_SEASONS_FIXTURES_BEEN_CREATED = 'haveSeasonsFixturesBeenCreated';

export const API_ENDPOINT_USERS = '/api/users';
export const API_ENDPOINT_MISCELLANEOUS = '/api/miscellaneous';
export const API_ENDPOINT_ADMIN_FACTORS = '/api/admin-factors';
export const API_ENDPOINT_TEAMS = '/api/teams';
export const API_ENDPOINT_FIXTURES = '/api/fixtures';
export const API_ENDPOINT_LEAGUE_TABLE = '/api/league-table';

export const API_ENDPOINTS_TO_LOAD_ALL_DATA = [
    API_ENDPOINT_MISCELLANEOUS,
    API_ENDPOINT_ADMIN_FACTORS,
    API_ENDPOINT_TEAMS,
    API_ENDPOINT_FIXTURES, 
    API_ENDPOINT_LEAGUE_TABLE,
]