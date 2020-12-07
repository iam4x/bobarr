/* eslint no-param-reassign: off */
/* eslint require-await: off */
/* eslint import/no-commonjs: off */

module.exports = {
  env: { WEB_UI_API_URL: process.env.WEB_UI_API_URL },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: false,
      },
    ];
  },
};
