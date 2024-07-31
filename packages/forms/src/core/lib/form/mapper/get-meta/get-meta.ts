import { ReadyFieldsGroupSchema } from '../../../fields'
import { EventCallable } from 'effector'
import { FormApi, Node } from '../types'
import { map } from './map'
import {
  BatchedSchemaUpdatedPayload,
  FieldInteractionEventPayload,
  FieldInteractionEventPayloadBase,
} from '../map-schema/types'

export function getMeta(
  node: ReadyFieldsGroupSchema,
  schemaUpdated: EventCallable<FieldInteractionEventPayload>,
  batchedSchemaUpdated: EventCallable<BatchedSchemaUpdatedPayload>,
  focused: EventCallable<FieldInteractionEventPayloadBase>,
  blurred: EventCallable<FieldInteractionEventPayloadBase>
) {
  const values: Node = {}
  const errors: Node = {}
  const api: FormApi = {}

  const thisArg = {
    isValid: true,
    api,

    schemaUpdated,
    batchedSchemaUpdated,
    focused,
    blurred,
  }

  map.call(thisArg, node, values, errors)

  return { values, errors, api, isValid: thisArg.isValid }
}
