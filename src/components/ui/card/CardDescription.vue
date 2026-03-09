<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <p v-bind="attrs" :class="cn('text-sm text-muted-foreground', attrs.class)">
    <slot />
  </p>
</template>
