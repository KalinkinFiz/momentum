const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const withZero = (value) => (Number(value) < 10 ? `0${value}` : value);

const visibilityDay = (day) => DAYS[Number(day)];

const visibilityMonth = (month) => MONTHS[Number(month)];

const getTimeDay = (hours) => {
  if (hours >= 0 && hours < 6) return 'night';
  else if (hours >= 6 && hours < 12) return 'morning';
  else if (hours >= 12 && hours < 18) return 'day';
  else return 'evening';
};

const visibilityTimeDay = (hours) => getTimeDay(hours).capitalize();

const shuffle = (array) => array.sort(() => Math.random() - 0.5);