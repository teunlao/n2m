import { useCookies } from '@n2m/cookies'
import { useUniversalContext } from './use-universal-context.ts'

export function useUserLanguage() {
  const { req } = useUniversalContext()

  const langFromCookie = useCookies().get('i18n_redirected')
  const langFromHeader = req.headers.get('accept-language')?.slice(0, 2)
  const fallbackLang = 'ru'
  return langFromCookie || langFromHeader || fallbackLang
}
