import {
  defineProvider,
  defineTransientProvider,
  injectProvider,
  injectTransientProvider,
  registerProvider,
  registerTransientProvider,
} from './providers.ts'

const defineResource = defineProvider
const registerResource = registerProvider
const registerTransientResource = registerTransientProvider
const injectResource = injectProvider
const injectTransientResource = injectTransientProvider
const defineTransientResource = defineTransientProvider

export {
  defineResource,
  registerResource,
  registerTransientResource,
  injectResource,
  injectTransientResource,
  defineTransientResource,
}
