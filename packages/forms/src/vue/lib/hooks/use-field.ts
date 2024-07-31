import { computed } from 'vue'
import { useUnit } from 'effector-vue/composition'
import { getFields } from './utils'
import { ArrayField, ArrayFieldItemType, isPrimitiveValue, PrimitiveField, PrimitiveValue } from '../../../core/lib'
import { useUniversalContext } from '@n2m/shared-hooks'

export function useField<T extends PrimitiveValue>(field: PrimitiveField<T>) {
  const shape = useUnit(field)

  const vmodel = computed({
    get: () => shape.value.value,
    set: (value) => shape.change(value as T),
  })

  return {
    vmodel: vmodel,
    ...shape,
  }
}

export function useArrayField<
  T extends ArrayField<any>,
  Value extends ArrayFieldItemType = T extends ArrayField<any, infer D> ? D : never,
>(field: T) {
  const { scope } = useUniversalContext()
  const { values, change, changeError, reset, pop, push, replace, remove, swap, move, unshift, insert, ...params } =
    useUnit(field)

  const syncedValues = computed(() => {
    return values.value.map((item) => (isPrimitiveValue(item) ? item : getFields(item, scope)))
  })

  return {
    values: syncedValues,
    onChange: change,
    onChangeError: changeError,
    onReset: reset,
    onSwap: swap,
    onMove: move,
    onUnshift: unshift,
    onInsert: insert,
    onReplace: replace,
    onRemove: remove,
    onPop: pop,
    onPush: push,
    ...params,
  }
}
