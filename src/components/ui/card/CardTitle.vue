<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <h3 v-bind="attrs" :class="cn('text-2xl font-semibold leading-none tracking-tight', attrs.class)">
    <slot />
  </h3>
</template>
