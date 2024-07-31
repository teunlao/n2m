import { computed, ComputedRef, onUnmounted, Ref } from 'vue'
import { useUnit } from 'effector-vue/composition'
import type {
  ErrorsSchemaPayload,
  FormErrors,
  FormType,
  FormValues,
  PartialRecursive,
  ReadyFieldsGroupSchema,
} from '../../../core/lib'
import { getFields } from './utils'
import { useUniversalContext } from '@n2m/shared-hooks'
import { ReactFields } from '../../../react/lib'
import { FormEvent } from 'react'

interface UseFormProps {
  resetOnUnmount?: boolean
}

type ReactForm<
  Schema extends ReadyFieldsGroupSchema,
  Values extends FormValues<any> = FormValues<Schema>,
  Errors extends FormErrors<any> = FormErrors<Schema>,
> = {
  values: Ref<Values>
  errors: Ref<Errors>
  fields: ComputedRef<ReactFields<Schema>>

  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onValidate: () => void
  onReset: () => void
  onClear: () => void

  isValid: Ref<boolean>
  isDirty: Ref<boolean>
  isValidationPending: Ref<boolean>

  setValues: (payload: Values) => void
  setErrors: (payload: ErrorsSchemaPayload) => void
  setPartialValues: (payload: PartialRecursive<Values>) => void
}

type AnyForm = FormType<any, any, any>

export function useForm<
  T extends AnyForm,
  Schema extends ReadyFieldsGroupSchema = T extends FormType<infer K, any, any> ? K : never,
  Values extends FormValues<any> = T extends FormType<any, infer K, any> ? K : never,
  Errors extends FormErrors<any> = T extends FormType<any, any, infer K> ? K : never,
>(form: T, props?: UseFormProps): ReactForm<Schema, Values, Errors> {
  const { scope } = useUniversalContext()

  const { values, errors, submit, reset, clear, validate, ...formParams } = useUnit(form)

  const fields = computed<ReactFields<any>>(() => getFields(form.fields, scope))

  onUnmounted(() => {
    if (props?.resetOnUnmount) {
      reset()
    }
  })

  const onSubmit = () => {
    submit()
  }

  return {
    // @ts-ignore
    values,
    // @ts-ignore
    errors,
    fields,

    // @ts-ignore
    onSubmit: (e) => {
      e.preventDefault()
      onSubmit()
    },
    onReset: reset,
    onValidate: validate,
    onClear: clear,

    ...formParams,
  }
}
