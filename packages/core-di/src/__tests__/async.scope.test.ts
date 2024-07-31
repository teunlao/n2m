import { describe, it, expect } from 'vitest'
import {
  createContainer,
  createIdentifier,
  createAsyncScope,
  createImmediateAsyncScope,
  useScopedContainer,
} from '../server/index.ts'

describe('Async Container Usage', () => {
  const RequestIdId = createIdentifier<string>('requestId')
  const UserIdId = createIdentifier<number>('userId')

  it('should isolate dependencies between async requests using createAsyncScope', async () => {
    const rootContainer = createContainer()
    rootContainer.register(RequestIdId).toValue('global')
    const createRequestScope = createAsyncScope(rootContainer)
    const request1Promise = createRequestScope(async () => {
      const container = useScopedContainer()
      container.register(RequestIdId).toValue('request1')
      container.register(UserIdId).toValue(1)
      await new Promise((resolve) => setTimeout(resolve, 15))
      expect(container.resolve(RequestIdId)).toBe('request1')
      expect(container.resolve(UserIdId)).toBe(1)
    })
    const request2Promise = createRequestScope(async () => {
      const container = useScopedContainer()
      container.register(RequestIdId).toValue('request2')
      container.register(UserIdId).toValue(2)
      await new Promise((resolve) => setTimeout(resolve, 5))
      expect(container.resolve(RequestIdId)).toBe('request2')
      expect(container.resolve(UserIdId)).toBe(2)
    })
    await Promise.all([request1Promise, request2Promise])
    expect(rootContainer.resolve(RequestIdId)).toBe('global')
    expect(() => rootContainer.resolve(UserIdId)).toThrow()
  })

  it('should isolate dependencies between async requests using createImmediateAsyncScope', async () => {
    const rootContainer = createContainer()
    rootContainer.register(RequestIdId).toValue('global')
    const createRequestScope = createImmediateAsyncScope(rootContainer)

    const request1Promise = new Promise<void>((resolve, reject) => {
      createRequestScope(() => {
        const container = useScopedContainer()
        container.register(RequestIdId).toValue('request1')
        container.register(UserIdId).toValue(1)
        setTimeout(() => {
          try {
            expect(container.resolve(RequestIdId)).toBe('request1')
            expect(container.resolve(UserIdId)).toBe(1)
            resolve()
          } catch (error) {
            reject(error)
          }
        }, 15)
      })
    })

    const request2Promise = new Promise<void>((resolve, reject) => {
      createRequestScope(() => {
        const container = useScopedContainer()
        container.register(RequestIdId).toValue('request2')
        container.register(UserIdId).toValue(2)
        setTimeout(() => {
          try {
            expect(container.resolve(RequestIdId)).toBe('request2')
            expect(container.resolve(UserIdId)).toBe(2)
            resolve()
          } catch (error) {
            reject(error)
          }
        }, 5)
      })
    })

    await Promise.all([request1Promise, request2Promise])
    expect(rootContainer.resolve(RequestIdId)).toBe('global')
    expect(() => rootContainer.resolve(UserIdId)).toThrow()
  })

  it('should throw an error when accessing container outside of async context', () => {
    expect(() => useScopedContainer()).toThrow('Container is not available in this async context')
  })

  it('should support nested async scopes using createAsyncScope', async () => {
    const rootContainer = createContainer()
    rootContainer.register(RequestIdId).toValue('root')
    const createRequestScope = createAsyncScope(rootContainer.createScope())
    await createRequestScope(async () => {
      const outerContainer = useScopedContainer()
      outerContainer.register(RequestIdId).toValue('outer')
      expect(outerContainer.resolve(RequestIdId)).toBe('outer')
      await createRequestScope(async () => {
        const innerContainer = useScopedContainer()
        innerContainer.register(RequestIdId).toValue('inner')
        expect(innerContainer.resolve(RequestIdId)).toBe('inner')
      })
      expect(outerContainer.resolve(RequestIdId)).toBe('outer')
    })
    expect(rootContainer.resolve(RequestIdId)).toBe('root')
  })

  it('should support nested async scopes using createImmediateAsyncScope', async () => {
    const rootContainer = createContainer()
    rootContainer.register(RequestIdId).toValue('root')
    const createRequestScope = createImmediateAsyncScope(rootContainer.createScope())
    await new Promise<void>((resolve, reject) => {
      createRequestScope(() => {
        const outerContainer = useScopedContainer()
        outerContainer.register(RequestIdId).toValue('outer')
        expect(outerContainer.resolve(RequestIdId)).toBe('outer')
        new Promise<void>((innerResolve, innerReject) => {
          createRequestScope(() => {
            const innerContainer = useScopedContainer()
            innerContainer.register(RequestIdId).toValue('inner')
            expect(innerContainer.resolve(RequestIdId)).toBe('inner')
            innerResolve()
          })
        })
          .then(() => {
            expect(outerContainer.resolve(RequestIdId)).toBe('outer')
            resolve()
          })
          .catch(reject)
      })
    })
    expect(rootContainer.resolve(RequestIdId)).toBe('root')
  })

  it('should support parallel async operations within the same scope using createAsyncScope', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createAsyncScope(rootContainer.createScope())
    await createRequestScope(async () => {
      const container = useScopedContainer()
      container.register(RequestIdId).toValue('parallel')
      const operation1 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(useScopedContainer().resolve(RequestIdId)).toBe('parallel')
      }
      const operation2 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        expect(useScopedContainer().resolve(RequestIdId)).toBe('parallel')
      }
      await Promise.all([operation1(), operation2()])
    })
  })

  it('should support parallel async operations within the same scope using createImmediateAsyncScope', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createImmediateAsyncScope(rootContainer.createScope())
    await new Promise<void>((resolve, reject) => {
      createRequestScope(() => {
        const container = useScopedContainer()
        container.register(RequestIdId).toValue('parallel')
        const operation1 = new Promise<void>((opResolve, opReject) => {
          setTimeout(() => {
            try {
              expect(useScopedContainer().resolve(RequestIdId)).toBe('parallel')
              opResolve()
            } catch (error) {
              opReject(error)
            }
          }, 10)
        })
        const operation2 = new Promise<void>((opResolve, opReject) => {
          setTimeout(() => {
            try {
              expect(useScopedContainer().resolve(RequestIdId)).toBe('parallel')
              opResolve()
            } catch (error) {
              opReject(error)
            }
          }, 5)
        })
        // @ts-ignore
        Promise.all([operation1, operation2]).then(resolve).catch(reject)
      })
    })
  })

  // it('should handle errors and maintain context integrity using createImmediateAsyncScope', async () => {
  //   const rootContainer = createContainer()
  //   const createRequestScope = createImmediateAsyncScope(rootContainer)
  //   await new Promise<void>((resolve, reject) => {
  //     createRequestScope(() => {
  //       const container = useContainer()
  //       container.register(RequestIdId).toValue('error-test')
  //       try {
  //         throw new Error('Test error')
  //       } catch (error) {
  //         reject(error)
  //       }
  //     })
  //   }).catch(error => {
  //     expect(error.message).toBe('Test error')
  //     expect(() => useContainer()).toThrow('Container is not available in this async context')
  //   })
  // })

  it('should handle concurrent access without race conditions using createAsyncScope', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createAsyncScope(rootContainer)
    const results: string[] = []
    await Promise.all(
      Array(100)
        .fill(null)
        .map((_, index) =>
          createRequestScope(async () => {
            const container = useScopedContainer()
            container.register(RequestIdId).toValue(`request-${index}`)
            await new Promise((resolve) => setTimeout(resolve, Math.random() * 10))
            results.push(container.resolve(RequestIdId))
          })
        )
    )
    expect(results).toHaveLength(100)
    expect(new Set(results).size).toBe(100)
  })

  it('should handle concurrent access without race conditions using createImmediateAsyncScope', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createImmediateAsyncScope(rootContainer)
    const results: string[] = []
    await Promise.all(
      Array(100)
        .fill(null)
        .map(
          (_, index) =>
            new Promise<void>((resolve, reject) => {
              createRequestScope(() => {
                const container = useScopedContainer()
                container.register(RequestIdId).toValue(`request-${index}`)
                setTimeout(() => {
                  try {
                    results.push(container.resolve(RequestIdId))
                    resolve()
                  } catch (error) {
                    reject(error)
                  }
                }, Math.random() * 10)
              })
            })
        )
    )
    expect(results).toHaveLength(100)
    expect(new Set(results).size).toBe(100)
  })
})
