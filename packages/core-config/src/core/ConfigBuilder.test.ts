// import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
// import { ConfigBuilder } from './ConfigBuilder'
//
// describe('ConfigBuilder', () => {
//   beforeEach(() => {
//     vi.resetModules()
//     vi.stubGlobal('process', process)
//     beforeEach(() => {
//       import.meta.env.SSR = true
//     })
//   })
//
//   afterEach(() => {
//     vi.unstubAllGlobals()
//   })
//
//   it('should build config with default values', () => {
//     const builder = new ConfigBuilder()
//       .addOption('port', { defaultValue: 3000 })
//       .addOption('host', { defaultValue: 'localhost' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: 3000,
//       host: 'localhost',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config with environment variables', () => {
//     process.env.PORT = '8080'
//     process.env.HOST = 'example.com'
//
//     const builder = new ConfigBuilder()
//       .addOption('port', { envKey: 'PORT', defaultValue: 3000 })
//       .addOption('host', { envKey: 'HOST', defaultValue: 'localhost' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: '8080',
//       host: 'example.com',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config with fallback environment variables', () => {
//     process.env.FALLBACK_PORT = '8080'
//
//     const builder = new ConfigBuilder()
//       .addOption('port', {
//         envKey: 'PORT',
//         fallbackEnvKey: 'FALLBACK_PORT',
//         defaultValue: 3000,
//       })
//       .addOption('host', { defaultValue: 'localhost' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: '8080',
//       host: 'localhost',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config with transform function', () => {
//     const builder = new ConfigBuilder()
//       .addOption('port', {
//         defaultValue: 3000,
//         transform: (value) => Number(value),
//       })
//       .addOption('host', { defaultValue: 'localhost' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: 3000,
//       host: 'localhost',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config with constants', () => {
//     const builder = new ConfigBuilder()
//       .addOption('port', { defaultValue: 3000 })
//       .addOption('host', { defaultValue: 'localhost' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: 3000,
//       host: 'localhost',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config without default value', () => {
//     process.env.PORT = '8080'
//     process.env.HOST = 'example.com'
//
//     const builder = new ConfigBuilder().addOption('port', { envKey: 'PORT' }).addOption('host', { envKey: 'HOST' })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: '8080',
//       host: 'example.com',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
//
//   it('should build config only with transform function', () => {
//     const builder = new ConfigBuilder()
//       .addOption('port', {
//         transform: () => Number('3033'),
//       })
//       .addOption('host', {
//         transform: () => 'www.EXAMPLE.COM',
//       })
//
//     const config = builder.build()
//
//     expect(config).toEqual({
//       port: 3033,
//       host: 'www.EXAMPLE.COM',
//       __serializeOptions: {
//         port: true,
//         host: true,
//       },
//     })
//   })
// })
