import { injectDependency } from '@n2m/core-di/next'
import { CookiesServiceToken, ICookieService } from '../../shared'

export function useCookies(): ICookieService {
  return injectDependency(CookiesServiceToken) as ICookieService
}
