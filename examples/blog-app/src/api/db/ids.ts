import { init } from '@paralleldrive/cuid2'

// https://github.com/paralleldrive/cuid2#parameterized-length
export const createDbId = init({ length: 12 })
