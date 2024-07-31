const supportedLanguages = ['en', 'ru']
export const getLanguageFromString = (lang?: unknown) => {
  if (typeof lang !== 'string') return 'en'
  return supportedLanguages.find((item) => item === lang.slice(0, 2)) || 'en'
}
