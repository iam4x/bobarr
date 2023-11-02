import getConfig from 'next/config';

const isServer = typeof window === 'undefined';

const {
  publicRuntimeConfig: { WEB_UI_API_URL },
  serverRuntimeConfig: { WEB_UI_SSR_API_URL },
} = getConfig();

export const apiURL = isServer
  ? WEB_UI_SSR_API_URL || 'http://api:4000'
  : WEB_UI_API_URL || `http://${window.location.hostname}:4000`;
