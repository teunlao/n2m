import type { AnySchema, AsyncValidationFn, ErrorsSchemaPayload } from '../../core/lib'
import { ZodError, ZodSchema } from 'zod'

export function zodAdapter<Schema extends AnySchema>(schemaFactory: () => ZodSchema<any>): AsyncValidationFn<Schema> {
  return async (values): Promise<ErrorsSchemaPayload | null> => {
    try {
      const schema = schemaFactory()
      await schema.parseAsync(values)

      return null
    } catch (e) {
      const { errors } = e as ZodError

      return errors.reduce((acc: ErrorsSchemaPayload, error) => {
        acc[error.path.join('.')] = error.message

        return acc
      }, {})
    }
  }
}
