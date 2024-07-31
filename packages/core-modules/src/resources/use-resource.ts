// @ts-expect-error effector does not have public types of withFactory
import { withFactory as withFastoryRow } from 'effector'
import { Identifier, useScopedContainer } from '@n2m/core-di'

type WithFactory = <R>({
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

export const withFactory = withFastoryRow as WithFactory

export function useResource<T extends (props: any) => any>(
  resourceIdentifier: Identifier<T>,
  props?: Parameters<T>[0]
): ReturnType<T> {
  const factory = useScopedContainer().resolve<T>(resourceIdentifier)!

  return withFactory({
    sid: props?.sid,
    fn: () => factory(props),
  })
}
