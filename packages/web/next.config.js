// eslint-disable-next-line import/no-commonjs
module.exports = {
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    // eslint-disable-next-line no-param-reassign
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
};
