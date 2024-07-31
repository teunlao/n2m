import React from 'react'
import { type Primitive } from './types.ts'

export type PropFunction<T, P> = (props: P, baseProps: P) => T

type Depth = [never, 0, 1, 2, 3, 4]

import { ComponentType } from 'react'

export type DeepPropOrFunction<T, P, D extends Depth[number] = 1> = [D] extends [never]
  ? T
  : T extends React.ReactElement
    ? T
    : T extends ComponentType<any>
      ? T
      : T extends Primitive
        ? T | PropFunction<T, P>
        : T extends (...args: any[]) => any
          ? PropFunction<T, P>
          : T extends any[]
            ? T | PropFunction<T, P>
            : T extends object
              ?
                  | { [K in keyof T]: DeepPropOrFunction<T[K], P, Depth[D]> }
                  | PropFunction<{ [K in keyof T]: DeepPropOrFunction<T[K], P, Depth[D]> }, P>
              : T | PropFunction<T, P>

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !React.isValidElement(value)

const isFunction = (value: unknown): value is Function => typeof value === 'function' && !React.isValidElement(value)

export function evaluateMixedProps<T, P>(configProps: DeepPropOrFunction<T, P>, flowProps: P, baseProps?: P): T {
  if (!isPlainObject(configProps)) {
    return isFunction(configProps) ? configProps(flowProps, resolveProps(baseProps)) : (configProps as T)
  }

  return Object.entries(configProps).reduce(
    (result, [key, value]) => {
      result[key] = isFunction(value) ? value(flowProps, resolveProps(baseProps)) : value
      return result
    },
    {} as Record<string, unknown>
  ) as T
}

export function resolveProps<T>(props: T): T {
  if (!isPlainObject(props)) return props

  return Object.entries(props).reduce(
    (result, [key, value]) => {
      result[key] = isFunction(value) ? value(props, undefined) : value
      return result
    },
    {} as Record<string, unknown>
  ) as T
}

export function invokeAction<T>(
  description: string,
  callback: () => T,
  { debug }: { debug: boolean } = { debug: false }
) {
  if (debug && !import.meta.env.PROD) {
    console.log(`taskManagerProvider >>> run >>> ${description}`)
  }

  return callback() as T
}

export const withDescription = invokeAction

export function defineAction<T>(description: string, handler: T): T {
  return handler
}
