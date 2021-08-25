/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')(['react-timezone-select']);
// const withImages = require('next-images');

module.exports = withTM({
    // Prefer loading of ES Modules over CommonJS
    async redirects() {
      return [
        {
          source: '/',
          destination: '/players',
          permanent: false,
        },
      ];
    },
  })

