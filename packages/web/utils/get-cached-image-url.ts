import { apiURL } from './api-url';

export function getImageURL(url: string) {
  return `${apiURL}/image-cache?i=${url}`;
}
