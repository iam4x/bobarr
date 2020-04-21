import { apiURL } from './api-url';

export function getImageURL(url: string | null) {
  return url
    ? `${apiURL}/image-cache?i=${url}`
    : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
}
