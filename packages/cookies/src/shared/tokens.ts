import { createToken } from '@n2m/core-di/next'
import { type ICookieService } from '../shared/types.ts'

export const CookiesServiceToken = createToken<ICookieService>('CookiesServiceToken')
