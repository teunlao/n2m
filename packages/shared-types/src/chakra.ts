import { styled, ChakraComponent, ComponentWithAs, ChakraStyledOptions, As, Text } from '@chakra-ui/react'

export type ChakraStyledOptionsWithProps<T extends Record<string, unknown>> = ChakraStyledOptions['baseStyle'] & T

