import { DefineComponent } from 'vue'

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>
export type VueComponent<T> = DefineComponent<T>
