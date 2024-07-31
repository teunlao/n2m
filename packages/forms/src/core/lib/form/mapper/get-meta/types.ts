import { ReadyFieldsGroupSchema } from '../../../fields'
import { FormApi, Node } from '../types'
import { EventCallable } from 'effector'
import {
  BatchedSchemaUpdatedPayload,
  FieldInteractionEventPayload,
  FieldInteractionEventPayloadBase,
} from '../map-schema/types'

export type MapFn = (
  currentNode: ReadyFieldsGroupSchema,
  resultValuesNode: Node,
  resultErrorsNode: Node,
  path?: string[]
) => void

export interface This {
  schemaUpdated: EventCallable<FieldInteractionEventPayload>
  batchedSchemaUpdated: EventCallable<BatchedSchemaUpdatedPayload>
  focused: EventCallable<FieldInteractionEventPayloadBase>
  blurred: EventCallable<FieldInteractionEventPayloadBase>

  api: FormApi
  isValid: boolean
}
