import React from 'react'
import { Identifier } from '@n2m/core-di'

export type ClassProvider = new (...args: any[]) => {}

export type ValueProvider = {
  token: Identifier<any>
  useValue: any
}

export type ClassTypeProvider = {
  token: Identifier<any>
  useClass: ClassProvider
}

export type Provider = ClassTypeProvider | ValueProvider

type LazyFactoryWithBase = {
  (...args: any[]): any
  __baseProps?: Record<string, any>
}

type FactoryWithBase = {
  (...args: any[]): any
  __baseProps?: Record<string, any>
}

export type ProviderDefinition = {
  token: Identifier<any>
  useClass?: ClassProvider
  useTransientFactory?: any
  useDynamicFactory?: () => any
  useLazyFactory?: LazyFactoryWithBase
  useFactory?: FactoryWithBase
  eager?: boolean
}

type SegmentComponent = React.ComponentType<any> & {
  __baseProps?: Record<string, any>
  __mergedConfigAndBaseProps?: Record<string, any>
}

export type SegmentDefinition = {
  token: Identifier<React.ElementType>
  component: SegmentComponent
}

export type DeepAnyify<T> = T extends object ? { [K in keyof T]: T[K] extends object ? DeepAnyify<T[K]> : any } : any

export type DeepAnyifyLimited<T, Depth extends number = 3> = {
  0: T
  1: AnyifyOneLevel<T>
  2: AnyifyOneLevel<AnyifyOneLevel<T>>
  3: AnyifyOneLevel<AnyifyOneLevel<AnyifyOneLevel<T>>>
}[Depth extends 0 | 1 | 2 | 3 ? Depth : 3]

export type RemoveUndefined<T> = T extends undefined
  ? never
  : T extends object
    ? { [K in keyof T as T[K] extends undefined ? never : K]: RemoveUndefined<T[K]> }
    : T

export type AnyifyOneLevel<T> = {
  [K in keyof T]: T[K] extends Primitive ? T[K] : any
}

export type Primitive = string | number | boolean | null | undefined
