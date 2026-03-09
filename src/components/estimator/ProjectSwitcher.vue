<script setup>
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import { formatCurrency } from '@/lib/formatters'

defineProps({
  activeProject: { type: Object, required: true },
  projectSummaries: { type: Array, required: true },
  projectCount: { type: Number, required: true },
})

defineEmits(['select-project', 'add-project', 'duplicate-project', 'remove-project'])
</script>

<template>
  <Card class="border-slate-200/80 bg-white/88 shadow-sm backdrop-blur">
    <CardHeader class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-2">
        <CardTitle class="text-3xl">Portefeuille projets</CardTitle>
        <CardDescription>Basculer entre projets sans perdre l'espace de travail principal.</CardDescription>
      </div>
      <div class="flex flex-wrap gap-3">
        <Button class="rounded-xl" @click="$emit('add-project')">Nouveau projet</Button>
        <Button variant="secondary" class="rounded-xl" @click="$emit('duplicate-project', activeProject.id)">
          Dupliquer
        </Button>
        <Button
          variant="destructive"
          class="rounded-xl"
          :disabled="projectCount === 1"
          @click="$emit('remove-project', activeProject.id)"
        >
          Supprimer
        </Button>
      </div>
    </CardHeader>
    <CardContent class="overflow-x-auto">
      <div class="flex min-w-max gap-3">
        <button
          v-for="project in projectSummaries"
          :key="project.id"
          type="button"
          class="w-[280px] rounded-2xl border p-4 text-left transition hover:border-primary/40 hover:bg-accent"
          :class="
            activeProject.id === project.id
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border bg-card'
          "
          @click="$emit('select-project', project.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <p class="font-medium text-foreground">{{ project.name }}</p>
              <p class="text-sm text-muted-foreground">
                {{ project.sprintCount }} sprint{{ project.sprintCount > 1 ? 's' : '' }} . {{ project.roleCount }}
                metier{{ project.roleCount > 1 ? 's' : '' }}
              </p>
            </div>
            <span class="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {{ formatCurrency(project.total) }}
            </span>
          </div>
        </button>
      </div>
    </CardContent>
  </Card>
</template>
