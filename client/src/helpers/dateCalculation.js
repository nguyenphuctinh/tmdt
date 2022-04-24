export function countdown(date) {
  const now = new Date();
  const eventDate = new Date(date);
  const diff = eventDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return {
    days,
    hours,
    minutes,
    seconds,
  };
}
export function increaseDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export function decreaseDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
export function increaseMonths(date, months) {
  var result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
export function getMonthDifference(startDate, endDate) {
  return (
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())
  );
}
