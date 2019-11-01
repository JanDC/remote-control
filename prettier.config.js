module.exports = {
  tabWidth: 2,
  trailingComma: 'es5',
  semi: true,
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: '*.scss',
      options: {
        trailingComma: false,
      },
    },
  ],
};
