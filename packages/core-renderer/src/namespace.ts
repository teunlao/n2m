export type { n2m }

/** Refine n2m types. */

declare global {
  namespace n2m {
    interface Config {}
    interface RenderProps {}
    interface ReqMeta {
      shell?: string
    }
  }
}
