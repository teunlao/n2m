// @ts-expect-error effector does not have public types of withFactory
import { withFactory as withEffectorFactoryRow } from 'effector'
import { Identifier, useScopedContainer } from '@n2m/core-di'
import { DeepPropOrFunction, resolveProps } from '../utils.ts'

type WithEffectorFactory = <R>({
  sid,
  name,
  loc,
  method,
  fn,
}: {
  sid: string
  name?: string
  loc?: any
  method?: string
  fn: () => R
}) => R

export const withEffectorFactory = withEffectorFactoryRow as WithEffectorFactory

export type ProviderConfig = {
  sid?: string
}

export function defineProvider<P, R>(factory: (initialProps: P) => R) {
  return (initialProps: P) => factory(initialProps as P)
}

export function registerProvider<T>(
  factory: (props: T) => any,
  currentProps?: DeepPropOrFunction<Partial<T>, T>,
  config?: ProviderConfig
): (props: T) => any {
  const withProps = () => {
    const mergedProps = withProps.__baseProps ?? currentProps

    return withEffectorFactory({
      sid: config?.sid ?? 'p',
      fn: () => factory({ ...(resolveProps(mergedProps) as T) }),
    })
  }

  withProps.__baseProps = currentProps

  return withProps
}

export function defineTransientProvider<P extends Record<string, any>, R>(factory: (props: P) => R) {
  return (initialProps: P) => (props: P) => factory({ ...(initialProps as P), ...(props as P) })
}

export function injectProvider<T>(providerIdentifier: Identifier<T>) {
  return useScopedContainer().resolve<T>(providerIdentifier)!
}

export function injectTransientProvider<T extends (props: any) => any>(
  providerIdentifier: Identifier<T>,
  props?: Parameters<T>[0] & { sid: string }
): ReturnType<T> {
  const factory = useScopedContainer().resolve<T>(providerIdentifier)!
  
  // TODO maybe we should refactor it, and even remove
  return withEffectorFactory({
    sid: props?.sid ?? 'tp',
    fn: () => factory(props),
  })
}

export function registerTransientProvider<T>(factory: (props: T) => any, initialProps?: Partial<T>): (props: T) => any {
  return () => factory({ ...(initialProps as T) })
}

export function registerAsyncLazyProvider<T>(
  asyncFactory: () => Promise<{ default: (props: T) => any }>,
  initialProps?: Partial<T>
): (props: T) => Promise<any> {
  return async (props: T) => {
    const module = await asyncFactory()
    const factory = module.default
    return factory({ reaction: (action: () => void) => () => action(), ...(initialProps as T), ...props })
  }
}
