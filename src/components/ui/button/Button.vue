<script setup>
import { cva } from 'class-variance-authority'
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'default',
  },
})

const attrs = useAttrs()

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm shadow-slate-900/10 hover:bg-primary/92',
        destructive: 'bg-destructive text-white shadow-sm shadow-rose-500/20 hover:bg-destructive/92',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-slate-200/80',
        outline: 'border border-input bg-white/90 shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-slate-600 hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
</script>

<template>
  <button v-bind="attrs" :class="cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class)">
    <slot />
  </button>
</template>
