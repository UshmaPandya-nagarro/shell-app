const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = withModuleFederationPlugin({
  remotes: {
    mfe1: isProduction
      ? 'https://charming-pastelito-802f20.netlify.app/remoteEntry.js'
      : 'http://localhost:4300/remoteEntry.js',

    mfe2: isProduction
      ? 'https://grand-lamington-61f65f.netlify.app/remoteEntry.js'
      : 'http://localhost:4400/remoteEntry.js',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
