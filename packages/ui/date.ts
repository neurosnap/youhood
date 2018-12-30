function addZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}

function militaryToTime(hour: number) {
  if (hour > 12) {
    return Math.abs(12 - hour);
  }

  return hour;
}

function getAmOrPm(hour: number) {
  return hour > 12 ? 'pm' : 'am';
}

function getLocalTime(date: Date): string {
  const rawHours = date.getHours();
  const hours = addZero(militaryToTime(rawHours));
  const amOrPm = getAmOrPm(rawHours);
  const time = `${hours}:${addZero(date.getMinutes())} ${amOrPm}`;
  return time;
}

export function formatDateTime(dateStr: string) {
  if (!dateStr) {
    return ['', ''];
  }

  const date = new Date(dateStr);

  const month = addZero(date.getMonth() + 1);
  const tDate = addZero(date.getDate());
  const d = `${month}/${tDate}/${date.getFullYear()}`;

  const time = getLocalTime(date);
  return [d, time];
}

export function formatDate(date: string) {
  const [d, time] = formatDateTime(date);
  return `${d} ${time}`;
}
