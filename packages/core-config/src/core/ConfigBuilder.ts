import superjson from 'superjson'

type ConfigKey = keyof NodeJS.ProcessEnv | keyof ImportMetaEnv

interface ConfigOption<T, Options extends Record<string, ConfigOption<any, Options>>> {
  key?: string
  envKey?: ConfigKey
  fallbackEnvKey?: ConfigKey
  defaultValue?: T
  transform?: (value: string | undefined | T, options: ConfigShape<Options>) => T
  serialize?: boolean
}

type ConfigShape<Options extends Record<string, ConfigOption<any, Options>>> = {
  [K in keyof Options]: Options[K]['defaultValue'] extends undefined
    ? undefined
    : NonNullable<Options[K]['defaultValue']>
}

export class ConfigBuilder<
  Options extends Record<string, ConfigOption<any, Options>> = {},
  C extends Record<string, any> = {},
> {
  private options: Options = {} as Options

  constructor(private rawConfig?: C) {}

  addOption<Key extends string, Value>(
    key: Key,
    option: ConfigOption<Value, Options>
  ): ConfigBuilder<Options & Record<Key, ConfigOption<Value, Options>>, C> {
    ;(this.options as any)[key] = { serialize: true, ...option } as any
    return this as unknown as ConfigBuilder<
      Options & Record<Key, ConfigOption<Value, Options & Record<Key, ConfigOption<Value, Options>>>>,
      C
    >
  }

  build(): ConfigShape<Options> {
    const config: any = {}
    const serializeOptions: any = {}

    const isServer = import.meta.env.SSR

    for (const option in this.options) {
      const { envKey, key = '', fallbackEnvKey, defaultValue, transform, serialize } = this.options[option]
      let value

      if (this.rawConfig && key in this.rawConfig) {
        value = this.rawConfig?.[key!]
      } else {
        if (isServer) {
          value = envKey ? process.env[envKey] : undefined
          if (value === undefined && fallbackEnvKey) {
            value = process.env[fallbackEnvKey]
          }
        }
        value = value ?? import.meta.env[`VITE_${envKey}`]
        value = value ?? defaultValue
      }

      if (transform) {
        value = transform(value, config)
      }

      config[option] = value
      serializeOptions[option] = serialize !== false
    }

    return { ...config, __serializeOptions: isServer ? serializeOptions : {} } as ConfigShape<Options>
  }

  static serialize(config: ConfigShape<any>): string {
    const { __serializeOptions, ...rest } = config
    const serializedConfig: Record<string, any> = {}
    for (const key in rest) {
      if (__serializeOptions[key]) {
        serializedConfig[key] = rest[key]
      }
    }
    return superjson.stringify(serializedConfig)
  }

  static parse<T>(serializedConfig: string): T {
    return superjson.parse(serializedConfig) as T
  }
}
