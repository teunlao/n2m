import { Json, attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import type {
  ArrayField,
  InsertOrReplacePayload,
  MovePayload,
  PushPayload,
  RemovePayload,
  SwapPayload,
  UnshiftPayload,
  CreateArrayFieldOptions,
  ArrayFieldItemType,
} from './types'
import { spread } from 'patronum'
import { FieldBatchedPayload, FieldBatchedSetter, FieldError, InnerArrayFieldApi } from '../types'
import { AnySchema, ReadyFieldsGroupSchema, UserFormSchema, prepareFieldsSchema } from '../fields-group'
import { PrimitiveValue, isPrimitiveValue } from '../primitive-field'
import { arrayFieldSymbol } from './symbol'
import { clearArrayFieldValuesMemory, filterUnused } from './utils'
import { mapSchema, setFormErrors } from '../../form/mapper'
import { isPrimitiveJsonValue } from '../primitive-field/utils'

const defaultOptions = {
  forkOnCreateForm: true,
}

export function createArrayField<T extends PrimitiveValue | AnySchema, Value = UserFormSchema<T>>(
  values: T[],
  overrides?: CreateArrayFieldOptions
): ArrayField<T, Value> {
  type Values = Value[]

  const clearOuterErrorOnChange = Boolean(overrides?.clearOuterErrorOnChange)

  function getDefaultValues() {
    return values.map(prepareFieldsSchema) as Values
  }

  function preparePayload<T extends ArrayFieldItemType>(payload: T | T[]): Values {
    return Array.isArray(payload) ? (payload.map(prepareFieldsSchema) as Values) : [prepareFieldsSchema(payload)]
  }

  const options = { ...defaultOptions, ...overrides }

  const clearNodesFx = createEffect(({ nodes }: ReturnType<typeof filterUnused>) => {
    for (const node of nodes) {
      if (isPrimitiveValue(node)) {
        break
      }

      clearArrayFieldValuesMemory(node as ReadyFieldsGroupSchema | PrimitiveValue)
    }
  })

  const $values = createStore(getDefaultValues(), {
    name: '<array field values>',
    serialize: {
      read(json) {
        if (!json) {
          throw new Error()
        }

        if (!Array.isArray(json)) {
          throw new Error()
        }

        return json.map((schema: any) => {
          const values = prepareFieldsSchema(schema.values)
          const errors = schema.errors

          const prepared = prepareFieldsSchema(values)
          const { $api, addBatchTask } = mapSchema(prepared)
          // eslint-disable-next-line effector/no-getState
          const api = $api.getState()

          setFormErrors(errors, api, addBatchTask, 'outer')

          return prepared
        })
      },

      write(state) {
        const readySchemas = state.map((value) =>
          isPrimitiveJsonValue(value) ? value : mapSchema(value as ReadyFieldsGroupSchema)
        )

        return readySchemas
          .map((payload) => {
            if (isPrimitiveJsonValue(payload)) {
              return payload
            }

            if (isPrimitiveValue(payload)) {
              return null
            }

            return {
              // eslint-disable-next-line effector/no-getState
              values: payload.$values.getState(),
              // eslint-disable-next-line effector/no-getState
              errors: payload.$errors.getState(),
            }
          })
          .filter(Boolean) as Json[]
      },
    },
  })

  const $innerError = createStore<FieldError>(null, {
    name: '<inner field error>',
  })

  const $outerError = createStore<FieldError>(overrides?.error ?? null, {
    name: '<outer field error>',
  })

  const $error = combine({
    innerError: $innerError,
    outerError: $outerError,
  }).map(({ innerError, outerError }) => outerError || innerError)

  const $isValid = $error.map((error) => error === null)
  const $isDirty = createStore(false)

  const batchedSetInnerError = createEvent<FieldBatchedSetter<FieldError>>()
  const batchedSetOuterError = createEvent<FieldBatchedSetter<FieldError>>()
  const batchedSetValue = createEvent<FieldBatchedSetter<T[]>>()
  const batchedClear = createEvent<FieldBatchedPayload>()
  const batchedReset = createEvent<FieldBatchedPayload>()

  const change = createEvent<T[]>('<field change>')
  const changed = createEvent<Values>('<field changed>')

  const reset = createEvent('<field reset>')
  const resetCompleted = createEvent<{ values: Values; error: FieldError }>('<field resetCompleted>')

  const clear = createEvent('<field clear>')
  const cleared = createEvent('<field cleared>')

  const setInnerError = createEvent<FieldError>('<field setInnerError>')
  const changeError = createEvent<FieldError>('<field changeError>')
  const errorChanged = createEvent<FieldError>('<field errorChanged>')

  const push = createEvent<PushPayload<T>>('<field push>')
  const pushed = createEvent<{
    params: PushPayload<T>
    result: Values
  }>()

  const swap = createEvent<SwapPayload>('<field swap>')
  const swapped = createEvent<{ params: SwapPayload; result: Values }>('<field swap>')

  const move = createEvent<MovePayload>('<field move>')
  const moved = createEvent<{ params: MovePayload; result: Values }>('<field moved>')

  const insert = createEvent<InsertOrReplacePayload<T>>('<field insert>')
  const inserted = createEvent<{
    params: InsertOrReplacePayload<T>
    result: Values
  }>('<field inserted>')

  const unshift = createEvent<UnshiftPayload<T>>('<field unshift>')
  const unshifted = createEvent<{
    params: UnshiftPayload<T>
    result: Values
  }>('<field unshifted>')

  const remove = createEvent<RemovePayload>('<field remove>')
  const removed = createEvent<{ params: RemovePayload; result: Values }>('<field removed>')

  const pop = createEvent<void>('<field pop>')
  const popped = createEvent<Values>('<field popped>')

  const replace = createEvent<InsertOrReplacePayload<T>>('<field replace>')
  const replaced = createEvent<{
    params: InsertOrReplacePayload<T>
    result: Values
  }>('<field replaced>')

  const syncFx = attach({
    source: $values,
    effect: async (values, newValues: Values): Promise<Values> => {
      await clearNodesFx(filterUnused(values, newValues))

      return [...newValues]
    },
    name: 'syncFx',
  })

  if (clearOuterErrorOnChange) {
    sample({ clock: $values, fn: () => null, target: $outerError })
  }

  sample({ clock: $values, fn: () => true, target: $isDirty })
  sample({ clock: syncFx.doneData, target: $values })

  sample({
    clock: [clear, batchedClear],
    fn: () => ({ values: [], error: null }),
    target: spread({
      values: syncFx,
      error: $outerError,
    }),
  })

  sample({
    clock: [reset, batchedReset],
    fn: () => {
      const values = getDefaultValues()
      const error = overrides?.error ?? null

      return {
        sync: values,
        completed: { values, error },
        error,
      }
    },
    target: spread({
      sync: syncFx,
      completed: resetCompleted,
      error: $outerError,
    }),
  })

  sample({
    clock: [clear, batchedClear],
    target: cleared,
  })

  const pushFx = attach({
    source: $values,
    effect: (values, payload: PushPayload<T>) => values.concat(preparePayload(payload)),
    name: 'pushFx',
  })

  const swapFx = attach({
    source: $values,
    effect: (values, payload: SwapPayload) => {
      const newValues = [...values]

      const element = newValues[payload.indexA]

      newValues[payload.indexA] = newValues[payload.indexB]
      newValues[payload.indexB] = element

      return newValues
    },
    name: 'swapFx',
  })

  const moveFx = attach({
    source: $values,
    effect: (values, payload: MovePayload) => {
      const newValues = [...values]
      newValues.splice(payload.to, 0, ...newValues.splice(payload.from, 1))

      return newValues
    },
    name: 'moveFx',
  })

  const insertFx = attach({
    source: $values,
    effect: (values, payload: InsertOrReplacePayload<T>) => {
      const newValues = [...values]
      newValues.splice(payload.index, 0, ...preparePayload(payload.value))

      return newValues
    },
    name: 'insertFx',
  })

  const unshiftFx = attach({
    source: $values,
    effect: (values, payload: UnshiftPayload<T>) => {
      const newValues = [...values]
      newValues.unshift(...preparePayload(payload))

      return newValues
    },
    name: 'unshiftFx',
  })

  const removeFx = attach({
    source: $values,
    effect: async (values, payload: RemovePayload) => {
      const newValues = [...values]
      newValues.splice(payload.index, 1)[0]

      return newValues
    },
    name: 'removeFx',
  })

  const popFx = attach({
    source: $values,
    effect: (values) => {
      const newValues = [...values]
      newValues.pop()

      return newValues
    },
    name: 'popFx',
  })

  const replaceFx = attach({
    source: $values,
    effect: (values, payload: InsertOrReplacePayload<T>) => {
      const newValues = [...values]
      newValues.splice(payload.index, 1, ...preparePayload(payload.value))

      return newValues
    },
    name: 'replaceFx',
  })

  sample({
    clock: $values,
    target: changed,
  })

  sample({
    clock: batchedSetValue,
    fn: (payload) => preparePayload(payload.value),
    target: syncFx,
  })

  sample({
    clock: change,
    fn: (payload) => preparePayload(payload),
    target: syncFx,
  })

  sample({ clock: push, target: pushFx })

  sample({
    clock: pushFx.done,
    fn: ({ params, result }) => ({
      pushed: { params, result },
      values: result,
    }),
    target: spread({
      pushed,
      values: syncFx,
    }),
  })

  sample({ clock: swap, target: swapFx })

  sample({
    clock: swapFx.done,
    fn: ({ params, result }) => ({
      swapped: { params, result },
      values: result,
    }),
    target: spread({
      swapped,
      values: syncFx,
    }),
  })

  sample({ clock: move, target: moveFx })

  sample({
    clock: moveFx.done,
    fn: ({ params, result }) => ({
      moved: { params, result },
      values: result,
    }),
    target: spread({
      moved,
      values: syncFx,
    }),
  })

  sample({ clock: insert, target: insertFx })

  sample({
    clock: insertFx.done,
    fn: ({ params, result }) => ({
      inserted: { params, result },
      values: result,
    }),
    target: spread({
      inserted,
      values: syncFx,
    }),
  })

  sample({ clock: unshift, target: unshiftFx })

  sample({
    clock: unshiftFx.done,
    fn: ({ params, result }) => ({
      unshifted: { params, result },
      values: result,
    }),
    target: spread({
      unshifted,
      values: syncFx,
    }),
  })

  sample({
    clock: remove,
    target: removeFx,
  })

  sample({
    clock: removeFx.done,
    fn: ({ params, result }) => ({
      removed: { params, result },
      values: result,
    }),
    target: spread({
      removed,
      values: syncFx,
    }),
  })

  sample({
    clock: pop,
    target: popFx,
  })

  sample({
    clock: popFx.doneData,
    fn: (values) => values,
    target: [syncFx, popped],
  })

  sample({
    clock: replace,
    target: replaceFx,
  })

  sample({
    clock: replaceFx.done,
    fn: ({ params, result }) => ({
      replaced: { params, result },
      values: result,
    }),
    target: spread({
      replaced,
      values: syncFx,
    }),
  })

  sample({
    clock: changeError,
    target: $outerError,
  })

  sample({
    clock: setInnerError,
    target: $innerError,
  })

  sample({
    clock: changeError,
    target: $outerError,
  })

  sample({
    clock: setInnerError,
    target: $innerError,
  })

  sample({
    clock: batchedSetInnerError,
    fn: (payload) => payload.value,
    target: $innerError,
  })

  sample({
    clock: batchedSetOuterError,
    fn: (payload) => payload.value,
    target: $outerError,
  })

  sample({
    clock: batchedSetInnerError,
    fn: (payload) => payload.value,
    target: $innerError,
  })

  sample({
    clock: batchedSetOuterError,
    fn: (payload) => payload.value,
    target: $outerError,
  })

  sample({
    clock: $error,
    target: errorChanged,
  })

  return {
    type: arrayFieldSymbol,

    batchedSetInnerError,
    batchedSetOuterError,
    batchedSetValue,
    batchedClear,
    batchedReset,

    $values,
    $error,
    $outerError,
    $innerError,

    $isDirty,
    $isValid,

    setInnerError,
    changeError,
    errorChanged,

    change,
    changed,

    push,
    pushed,

    swap,
    swapped,

    move,
    moved,

    clear,
    cleared,

    insert,
    inserted,

    unshift,
    unshifted,

    remove,
    removed,

    pop,
    popped,

    replace,
    replaced,

    reset,
    resetCompleted,

    forkOnCreateForm: options.forkOnCreateForm,

    fork: (options?: CreateArrayFieldOptions) => createArrayField(values, { ...overrides, ...options }),

    '@@unitShape': () => ({
      values: $values,
      error: $error,

      isDirty: $isDirty,
      isValid: $isValid,

      change,
      changeError,

      clear,
      reset,

      push,
      move,
      swap,
      insert,
      unshift,
      remove,
      pop,
      replace,
    }),
  } as ArrayField<T, Value> & InnerArrayFieldApi
}
