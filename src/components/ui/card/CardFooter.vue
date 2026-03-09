<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" :class="cn('flex items-center p-6 pt-0', attrs.class)">
    <slot />
  </div>
</template>
