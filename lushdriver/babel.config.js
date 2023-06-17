// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types', {loose: true}],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      ['react-native-reanimated/plugin'],
      ['@babel/plugin-proposal-class-properties', {loose: true}],
      ['@babel/plugin-proposal-private-methods', {loose: true}],
    ],
  };
};
