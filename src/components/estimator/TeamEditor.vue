<script setup>
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Input from '@/components/ui/input/Input.vue'
import { formatCurrency } from '@/lib/formatters'

defineProps({
  open: { type: Boolean, default: false },
  project: { type: Object, required: true },
})

defineEmits(['add-role', 'remove-role', 'move-role', 'close'])
</script>

<template>
  <div class="fixed inset-0 z-30" :class="open ? 'pointer-events-auto' : 'pointer-events-none'">
    <div
      class="absolute inset-0 bg-slate-950/10 transition-opacity"
      :class="open ? 'opacity-100' : 'opacity-0'"
      @click="$emit('close')"
    ></div>

    <div
      class="absolute bottom-4 right-4 w-[min(680px,calc(100vw-2rem))] transition-all duration-200"
      :class="open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'"
    >
      <Card class="max-h-[78vh] overflow-hidden border-slate-200/90 bg-white/96 shadow-2xl shadow-slate-900/15 backdrop-blur">
        <CardHeader class="flex flex-col gap-4 border-b border-slate-200 bg-white/90 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2">
            <CardTitle class="text-3xl">Equipe projet</CardTitle>
            <CardDescription>
              Modifiez les metiers, leurs abbreviations et leurs TJM. Le plan de charge s'adapte instantanement.
            </CardDescription>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button variant="secondary" class="rounded-xl" @click="$emit('close')">Fermer</Button>
            <Button class="rounded-xl" @click="$emit('add-role')">Ajouter un metier</Button>
          </div>
        </CardHeader>
        <CardContent class="max-h-[calc(78vh-108px)] space-y-4 overflow-auto p-4">
          <div
            v-for="(role, roleIndex) in project.roles"
            :key="role.id"
            class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
          >
            <div class="mb-4 flex items-center justify-between gap-3">
              <span class="rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                {{ formatCurrency(role.rate) }}
              </span>
              <div class="flex items-center gap-1">
                <Button variant="ghost" size="sm" :disabled="roleIndex === 0" @click="$emit('move-role', role.id, -1)">
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="roleIndex === project.roles.length - 1"
                  @click="$emit('move-role', role.id, 1)"
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="project.roles.length === 1"
                  @click="$emit('remove-role', role.id)"
                >
                  Retirer
                </Button>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_140px]">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Metier</label>
                <Input v-model="role.name" class="rounded-xl" placeholder="Ex. Product owner" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Abreviation</label>
                <Input v-model="role.shortName" class="rounded-xl" placeholder="Ex. PO" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">TJM</label>
                <Input v-model.number="role.rate" type="number" min="0" step="10" class="rounded-xl" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
