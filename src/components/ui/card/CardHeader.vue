<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" :class="cn('flex flex-col space-y-1.5 p-6', attrs.class)">
    <slot />
  </div>
</template>
