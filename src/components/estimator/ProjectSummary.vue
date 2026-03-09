<script setup>
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { formatNumber } from '@/lib/formatters'

const props = defineProps({
  project: { type: Object, required: true },
  totals: { type: Object, required: true },
})

function sortedRoleLoads() {
  return [...props.project.roles]
    .map((role) => ({
      id: role.id,
      name: role.shortName || role.name,
      days: props.totals.roleTotals[role.id] || 0,
    }))
    .sort((a, b) => b.days - a.days)
}
</script>

<template>
  <Card class="border-slate-200/80 bg-white/92 shadow-sm">
    <CardContent class="space-y-3 p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">Jours theoriques</span>
          <span class="font-semibold text-slate-900">{{ formatNumber(totals.theoreticalDays) }} j</span>
          <span class="text-slate-300">|</span>
          <span class="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">Charge realiste</span>
          <span class="font-semibold text-slate-900">{{ formatNumber(totals.realisticDays) }} j</span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Metiers mobilises</span>
          <span
            v-for="role in sortedRoleLoads()"
            :key="role.id"
            class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
          >
            {{ role.name }}: <span class="font-semibold text-slate-900">{{ formatNumber(role.days) }} j</span>
          </span>
        </div>
      </div>

      <details class="group rounded-2xl border border-slate-200 bg-slate-50/80">
        <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-700">
          <span>Plus de statistiques equipe</span>
          <span class="text-slate-400 transition group-open:rotate-180">⌄</span>
        </summary>
        <div class="grid gap-2 border-t border-slate-200 px-4 py-3 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="role in sortedRoleLoads()"
            :key="`stats-${role.id}`"
            class="rounded-xl bg-white px-3 py-2 text-sm"
          >
            <p class="font-medium text-slate-900">{{ role.name }}</p>
            <p class="mt-1 text-slate-500">Charge totale: <span class="font-semibold text-slate-900">{{ formatNumber(role.days) }} j</span></p>
            <p class="text-slate-500">
              Part de charge:
              <span class="font-semibold text-slate-900">
                {{ totals.realisticDays ? formatNumber((role.days / totals.realisticDays) * 100) : '0' }}%
              </span>
            </p>
          </div>
        </div>
      </details>
    </CardContent>
  </Card>
</template>
