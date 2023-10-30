/*
 * A File with app constants
 */
export const APP_TITLE = "My Main Application";

export const API_TOKEN = "8uu9LPLgKyws3NVqthpRp8CjmNmfa2lIsA8a3Nk9";

const API_URL = "https://quizapi.io/api/v1/questions?apiKey=gFw12ibkon5waeNGdRcrJMMYOZbTrrK3JYMRkpA8&";

const API_CATEGORIES = [
  'Linux',
  'Bash',
  'Docker',
  'Uncategorized',
  'SQL',
  'CMS',
  'Code',
  'DevOps',
]
const API_DIFFICULTIES = [
  'Easy',
  'Medium',
  'Hard',
];
const API_LIMIT = { min: 1, max: 100 };

const API_TIMEOUT = 15;

export { API_URL, API_CATEGORIES, API_DIFFICULTIES, API_LIMIT, API_TIMEOUT };

