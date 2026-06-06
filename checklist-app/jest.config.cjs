module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|sass)$': 'identity-obj-proxy'
  }
};
