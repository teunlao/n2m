import { defineTokens } from '@chakra-ui/react'

export const colors = defineTokens.colors({
  primary: {},
  accent: {
    main: { value: '#fc8e46' },
    focus: { value: '#FF9753' },
    active: { value: '#FB3F02' },
    icon: { value: '#FF6825' },
  },
  additional: {
    neutral: { value: '#948ABF' },
  },
  bg: {
    // darkest: { value: '#03011f' },
    darker: { value: '#1E1D26' },
    dark: { value: '#272532' },
    medium: { value: '#322F41' },
    light: { value: '#39364A' },
    lightest: { value: '#423E56' },
  },
})
