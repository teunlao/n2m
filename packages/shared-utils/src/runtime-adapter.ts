type Adapter<T> = () => T

interface RuntimeAdapter<T> {
  if: boolean
  then: Adapter<T>
  else: Adapter<T>
}

export function runtimeAdapter<T>(options: RuntimeAdapter<T>): T {
  if (options.if) {
    return options.then()
  } else {
    return options.else()
  }
}
