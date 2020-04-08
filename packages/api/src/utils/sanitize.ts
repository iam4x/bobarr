export function sanitize(str: string) {
  return str
    .toLowerCase()
    .replace(/,/g, ' ')
    .replace(/\./g, ' ')
    .replace(/-/g, ' ')
    .replace(/\(|\)/g, '')
    .replace(/\[|\]/g, '')
    .replace(/[az]'/g, ' ')
    .replace(/:/g, ' ');
}
