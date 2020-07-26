const host = typeof window === 'undefined' ? 'api' : window.location.hostname;
export const apiURL = `http://${host}:4000`;
// export const apiURL = `http://192.168.1.46:4000`;
