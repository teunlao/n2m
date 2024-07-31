import React, { lazy, useMemo } from 'react'
import { Identifier, injectDependency, useScopedContainer } from '@n2m/core-di'
import { type DeepPropOrFunction, evaluateMixedProps } from '../utils.ts'
import { infer, Inferable } from '../hooks.ts'

type SegmentOptions = {
  force?: boolean
  ignoreModuleInitialProps?: boolean
  enabled?: Inferable<boolean>
}

export function configureSegment<T>(
  component: React.FC<T> & {
    __baseProps?: Record<string, any>
    __mergedConfigAndBaseProps?: Record<string, any>
  },
  configProps: DeepPropOrFunction<Partial<T>, T>,
  options: SegmentOptions = { force: false, ignoreModuleInitialProps: false }
): React.FC<T> {
  const segmentFactory = (flowProps: T) => {
    const baseProps = segmentFactory.__baseProps

    const mergedConfigAndBaseProps = options.ignoreModuleInitialProps
      ? {}
      : (segmentFactory.__mergedConfigAndBaseProps ?? configProps)

    const evaluatedProps = evaluateMixedProps(mergedConfigAndBaseProps, flowProps as T, baseProps as T)

    if (options.force) {
      const combinedProps = { ...flowProps, ...evaluatedProps }
      return React.createElement<any>(component, combinedProps)
    }

    const combinedProps = { ...evaluatedProps, ...flowProps }

    if (infer(options.enabled) === false) {
      return null
    }

    if (import.meta.env.STORYBOOK) {
      // @ts-expect-error
      window.__THEME__[component.name] = configProps
    }

    return React.createElement<any>(component, combinedProps)
  }

  segmentFactory.displayName = component?.displayName
  segmentFactory.__baseProps = configProps
  segmentFactory.__mergedConfigAndBaseProps = null

  return segmentFactory
}

type SegmentContainerProps<T> = {
  token: Identifier<React.FC<T>>
  children?: React.ReactElement | React.ReactNode
} & Partial<T>

type SegmentContainerFactory = <T>(props: SegmentContainerProps<T>) => React.ReactElement | null

const SegmentContainerInner = function SegmentContainerInner<T>({ token, ...props }: SegmentContainerProps<T>) {
  const Component = useMemo(() => {
    const ResolvedComponent = injectDependency(token, { throwIfNotFound: false }) as React.ComponentType<T>

    if (!ResolvedComponent) {
      return () => <div>{token.value} not registered</div>
    }

    ResolvedComponent.displayName = token.value

    return ResolvedComponent
  }, [token])

  return <Component {...(props as T & React.JSX.IntrinsicAttributes)} />
}

export const SegmentContainerCached: SegmentContainerFactory = React.memo(
  SegmentContainerInner
) as SegmentContainerFactory
export const SegmentContainer: SegmentContainerFactory = SegmentContainerInner as SegmentContainerFactory

export function useSegment<P = {}>(
  token: Identifier<React.FC<React.PropsWithChildren<P>>>
): React.FC<React.PropsWithChildren<P>> {
  return useMemo(() => {
    const Component = useScopedContainer().resolve(token) as React.FC<React.PropsWithChildren<P>>
    Component.displayName = token.toString()

    const WrappedComponent: React.FC<React.PropsWithChildren<P>> = (props: P) => {
      return <Component {...(props as P & React.JSX.IntrinsicAttributes)} />
    }

    WrappedComponent.displayName = `Wrapped${Component.displayName || 'Component'}`

    return WrappedComponent
  }, [token])
}

type LazyComponentModule = { [key: string]: React.ComponentType<any> }

export function lazyLoad<T extends LazyComponentModule, K extends keyof T>(
  factory: () => Promise<T>,
  name: K
): React.LazyExoticComponent<T[K]> {
  return lazy(() => factory().then((module) => ({ default: module[name] })))
}
