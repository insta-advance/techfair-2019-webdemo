module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'max-len': ['error', 140],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
  },
  env: {
    node: true,
    jest: true,
  },
};
