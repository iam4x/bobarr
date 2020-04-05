import { padStart } from 'lodash';

export function formatNumber(value: number) {
  return value.toString().length >= 2
    ? value.toString()
    : padStart(value.toString(), 2, '0');
}
