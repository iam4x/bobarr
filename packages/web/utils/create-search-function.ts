import { get } from 'lodash';

const sanatize = (value: string | number) =>
  typeof value === 'string'
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : value?.toString();

export function createSearchFunction(fields: string[], searchQuery: string) {
  return (obj: any) =>
    fields.some((field) =>
      sanatize(get(obj, field) || '').includes(sanatize(searchQuery))
    );
}
