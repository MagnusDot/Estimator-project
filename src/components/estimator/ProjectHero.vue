<script setup>
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { formatCurrency, formatNumber } from '@/lib/formatters'

defineProps({
  project: { type: Object, required: true },
  totals: { type: Object, required: true },
})
</script>

<template>
  <Card class="overflow-hidden border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(248,250,252,0.92)_100%)] shadow-sm">
    <CardContent class="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.35fr)_360px] xl:items-stretch">
      <div class="rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_22%),linear-gradient(135deg,_#0f172a_0%,_#172554_52%,_#111827_100%)] p-5 text-white shadow-lg shadow-slate-900/15">
        <div class="space-y-5">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-sky-100/70">Estimation AO</p>
            <Input
              v-model="project.name"
              class="h-16 rounded-2xl border-white/10 bg-white/10 text-4xl font-semibold tracking-tight text-white placeholder:text-white/35"
              placeholder="Nom du projet"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-200">Client / programme</label>
              <Input
                v-model="project.clientName"
                class="rounded-xl border-white/10 bg-white/10 text-white placeholder:text-slate-400"
                placeholder="Client / programme"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-200">Notes</label>
              <Textarea
                v-model="project.notes"
                class="min-h-[108px] rounded-xl border-white/10 bg-white/10 text-white placeholder:text-slate-400"
                placeholder="Contexte, hypotheses, contraintes..."
              />
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Budget total HT</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{{ formatCurrency(totals.cost) }}</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Charge realiste</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{{ formatNumber(totals.realisticDays) }} j</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Nombre de sprints</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{{ totals.sprintCount }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
