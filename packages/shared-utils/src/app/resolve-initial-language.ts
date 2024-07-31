import { R } from '@n2m/shared-utils'

interface LocaleOptions {
  cookie?: string | undefined
  header?: string | null
}

const getLocaleFromHeader = (header?: string | null): string | undefined => header?.slice(0, 2)
const getLocaleFromDocument = (): string | undefined => navigator.language.slice(0, 2)
const getLocaleFromCookie = (cookie?: string | undefined): string | undefined => cookie

const FALLBACK_LOCALE = 'ru'

export const resolveInitialLanguage = ({ cookie, header }: LocaleOptions): string => {
  const resolvers = [
    () => getLocaleFromCookie(cookie),
    import.meta.env.SSR ? () => getLocaleFromHeader(header) : getLocaleFromDocument,
  ]

  return (
    R.pipe(
      resolvers,
      R.map((resolver) => resolver()),
      R.find((locale) => !!locale)
    ) ?? FALLBACK_LOCALE
  )
}
