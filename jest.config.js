module.exports = {
  testEnvironment: 'enzyme',
  setupTestFrameworkScriptFile: './tests.js',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@youhood/(.*)': '<rootDir>/packages/$1',
  },
  testURL: 'http://localhost',
  globals: {
    'ts-jest': {
      skipBabel: false,
    },
  },
};
