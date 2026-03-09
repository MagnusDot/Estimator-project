<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div
    v-bind="attrs"
    :class="cn('rounded-2xl border border-border/90 bg-card text-card-foreground shadow-sm shadow-slate-200/60', attrs.class)"
  >
    <slot />
  </div>
</template>
