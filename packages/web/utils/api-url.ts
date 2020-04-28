const host = typeof window === 'undefined' ? 'api' : window.location.hostname;
export const apiURL = `http://${host}:4000`;
