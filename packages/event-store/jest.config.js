const rootConfig = require('../jest.config');

module.exports = {
  ...rootConfig,

  // This code will remain untested for now since they are unreleased features.
  modulePathIgnorePatterns: ['src/features'],
};
