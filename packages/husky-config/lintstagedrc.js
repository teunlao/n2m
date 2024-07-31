module.exports = {
  '*.{js,ts,vue,tsx}': [
    'eslint --quiet',
  ],
  '*.html': ['prettier --write'],
}
