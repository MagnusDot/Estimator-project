<script setup>
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
const model = defineModel()
</script>

<template>
  <textarea
    v-model="model"
    v-bind="attrs"
    :class="
      cn(
        'flex min-h-24 w-full rounded-xl border border-input/90 bg-white/90 px-3.5 py-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] ring-offset-background placeholder:text-muted-foreground/90 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class,
      )
    "
  />
</template>
