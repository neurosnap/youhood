import * as format from 'date-fns/format';

export function formatDate(date: string) {
  return format(date, 'MM-DD-YYYY HH:mm a');
}