function registerModel<T, R>(modelFactory: (props: T) => R, initialProps?: T) {
  return () => modelFactory({ reaction: (action: () => void) => () => action(), ...(initialProps as T) })
}

function composeModel<T, R extends Record<'reactions', G>, G>(modelFactory: (props: T) => R, initialProps?: T) {
  const { reactions, ...rest } = registerModel<T, R>(modelFactory, initialProps)()

  return {
    units: rest as Omit<R, 'reactions'>,
    reactions: reactions as R['reactions'],
  }
}
