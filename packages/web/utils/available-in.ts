import dayjs from 'dayjs';

export function availableIn(date: dayjs.Dayjs) {
  const days = date.diff(new Date(), 'day');

  let label = `Available in ${days} days`;
  if (days === 0) label = `On air today`;
  if (days > 14) label = `Avaible on ${date.format('DD/MM')}`;

  // next year release
  if (date.format('YYYY') !== dayjs(new Date()).format('YYYY')) {
    label = `Available in ${date.format('YYYY')}`;
  }

  if (date.isBefore(new Date())) {
    label = `Released on ${date.format('DD/MM/YYYY')}`;
  }

  return label;
}
