import { createToken } from '@n2m/core-di'
import React from 'react'
import { type LayoutProvider } from './layout.provider.ts'

export const LayoutSegmentToken = createToken<React.FC>('LayoutSegmentToken')
export const LayoutProviderToken = createToken<LayoutProvider>('LayoutProviderToken')
