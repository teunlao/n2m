import { StoreValue } from 'effector'
import { ArrayField } from '../array-field'
import { PrimitiveField, PrimitiveValue } from '../primitive-field'

type ReadyFieldsSchemaFieldType = PrimitiveField | ArrayField<any> | ReadyFieldsGroupSchema

type RawFieldsSchemaFieldType =
  | PrimitiveValue
  | RawFieldsSchemaFieldType[]
  | RawFieldsGroupSchema
  | ReadyFieldsSchemaFieldType

export type RawFieldsGroupSchema = {
  [k in string]: RawFieldsSchemaFieldType
}

export type ReadyFieldsGroupSchema = {
  [k in string]: PrimitiveField | ArrayField<any> | ReadyFieldsGroupSchema
}

export type AnySchema = RawFieldsGroupSchema | ReadyFieldsGroupSchema

export type UserFormSchema<T extends AnySchema | PrimitiveValue> = T extends PrimitiveValue
  ? T
  : {
      [K in keyof T]: T[K] extends PrimitiveValue
        ? PrimitiveField<T[K]>
        : T[K] extends Array<any>
        ? ArrayField<T[K][number]>
        : T[K] extends PrimitiveField<any>
        ? T[K]
        : T[K] extends ArrayField<any>
        ? ArrayField<
            T[K] extends ArrayField<infer K, any> ? K : never,
            UserFormSchema<StoreValue<T[K]['$values']>[number]>
          >
        : T[K] extends AnySchema
        ? UserFormSchema<T[K]>
        : ReadyFieldsGroupSchema
    }
