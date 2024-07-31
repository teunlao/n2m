import { AsyncComponentLoader, Component, defineComponent, h } from 'vue'

type SegmentProps = Record<string, any>

export function registerVueSegment<T extends SegmentProps>(
  component: Component | AsyncComponentLoader,
  props?: T
): Component {
  return defineComponent({
    setup(_, { slots }) {
      return () => h(component, props, slots)
    },
  })
}
