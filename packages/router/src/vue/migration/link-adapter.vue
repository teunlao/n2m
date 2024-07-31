<template>
  <Link
    v-if="useConfig().newRouter"
    v-bind="$attrs"
    :to="to"
    :params="params"
    :query="query"
    :class="className"
    :active-class="activeClassName"
    :inactive-class="inactiveClassName"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </Link>
  <RouterLink v-else v-bind="legacyFallback" @click="$emit('click', $event)">
    <slot></slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { RouterLink, RouterLinkProps } from 'vue-router'
import { RouteInstance, RouteParams, RouteQuery } from '../../core'
import Link from '../link.vue'
import { useConfig } from '@n2m/core-config/shared'

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
  legacyFallback: {
    type: Object as PropType<RouterLinkProps>,
    default: () => ({}),
  },
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>
