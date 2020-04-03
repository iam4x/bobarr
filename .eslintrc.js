module.exports = {
  extends: ['algolia', 'algolia/react', 'algolia/typescript'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'import/extensions': 'off',
    'import/no-unresolved': 'off',

    'new-cap': 'off',
    'no-console': 'warn'
  }
};
