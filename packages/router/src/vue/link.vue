<template>
  <a :href="href" :class="linkClasses" :target="target" v-bind="$attrs" @click="handleClick">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { computed, ComputedRef, PropType, useAttrs } from 'vue'
import clsx from 'clsx'
import { useUnit } from 'effector-vue/composition'
import { buildPath, RouteInstance, RouteParams, RouteQuery } from '../core'
import { useRouter } from '../react'
import { scopeBind } from 'effector'
import { injectDependency } from '@n2m/core-di'
import { RouteObjectInternal } from '../core/types.ts'
import { CurrentEffectorScopeToken } from '@n2m/adapter-effector'

const props = defineProps({
  to: {
    type: [Object, String] as PropType<RouteInstance<RouteParams> | string>,
    required: true,
  },
  params: {
    type: Object as PropType<RouteParams>,
    default: () => ({}),
  },
  query: {
    type: Object as PropType<RouteQuery>,
    default: () => ({}),
  },
  className: {
    type: String,
    default: '',
  },
  activeClassName: {
    type: String,
    default: '',
  },
  inactiveClassName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const isExternalLink = computed(() => typeof props.to === 'string')

const router = useRouter()
const routeObj = computed(() => {
  if (isExternalLink.value) {
    return null
  }
  return router.routes.find((routeObj) => routeObj.route === props.to)
}) as ComputedRef<RouteObjectInternal<any>>

if (!routeObj.value) {
  console.error('route.obj', routeObj)
  console.error('[RouteLink] Route not found')
}

const isOpened = useUnit(routeObj.value?.route?.$isOpened)
const navigate = computed(() => {
  if (isExternalLink.value) {
    return null
  }

  // @ts-expect-error
  return scopeBind(props.to?.navigate, { scope: injectDependency(CurrentEffectorScopeToken) })
})

const linkClasses = computed(() =>
  clsx(props.className, isOpened.value ? props.activeClassName : props.inactiveClassName)
)

const href = computed(() => {
  if (isExternalLink.value) {
    return props.to as string
  }

  try {
    return buildPath({
      pathCreator: routeObj.value.path,
      params: props.params || {},
      query: props.query || {},
    })
  } catch (e) {
    console.error('[RouteLink] Error while building path', e)
    return ''
  }
})

const attrs = useAttrs()
const target = computed(() => attrs.target as string | undefined)

function handleClick(event: MouseEvent) {
  emit('click', event)

  // if (event.defaultPrevented) {
  //   console.log('defaultPrevented')
  //   return
  // }

  if (target.value && target.value !== '_self') {
    return
  }

  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return
  }

  event.preventDefault()

  if (isExternalLink.value || !navigate.value) {
    return
  }

  try {
    navigate.value({
      params: props.params || ({} as RouteParams),
      query: props.query || {},
    })
  } catch (e) {
    console.error('[RouteLink] Error while navigating', e)
  }
}
</script>
