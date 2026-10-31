module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', { moduleName: '@env', path: '.env' }],
    // zod v4's ESM build uses `export * as x from` syntax that needs this
    '@babel/plugin-transform-export-namespace-from',
    // must stay last per react-native-reanimated v4 setup
    'react-native-worklets/plugin',
  ],
};
