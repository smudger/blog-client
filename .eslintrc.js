module.exports = {
  env: {
    browser: true,
    mocha: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:gridsome/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'jest/no-deprecated-functions': 'off'
  }
}
