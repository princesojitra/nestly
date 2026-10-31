module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', { moduleName: '@env', path: '.env' }],
    // must stay last per react-native-reanimated v4 setup
    'react-native-worklets/plugin',
  ],
};
