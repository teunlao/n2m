import { createToken } from '@n2m/core-di'
import { type CoreEvents } from './core-events.factory.ts'
import { type Scope } from 'effector'

export const CoreEventsToken = createToken<CoreEvents>('CoreEvents')
export const CurrentEffectorScopeToken = createToken<Scope>('CurrentScope')
