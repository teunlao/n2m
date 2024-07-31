import { createSystem, defaultConfig, mergeConfigs } from '@chakra-ui/react'
import { colors } from './colors.ts'

export const config = mergeConfigs(defaultConfig, {
  theme: {
    tokens: {
      colors,
    },
  },
})

export const system = createSystem(config)
