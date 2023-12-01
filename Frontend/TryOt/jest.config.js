module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '<rootDir>/App.tsx'], 
  coverageReporters: ['lcov', 'text'],

  rootDir: './',
  testMatch:['<rootDir>/__tests__/**/*.test.ts(x)'],
  //  ['<rootDir>/__tests__/SignUpScreen.test.tsx'],
  

  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native)'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileTransformer.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileTransformer.js',
  },
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
};
