<script setup>
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Input from '@/components/ui/input/Input.vue'
import { formatCompactCurrency, formatDateDisplay, formatNumber } from '@/lib/formatters'

const props = defineProps({
  project: { type: Object, required: true },
  rows: { type: Array, required: true },
  totals: { type: Object, required: true },
  tableInsights: { type: Object, required: true },
})

defineEmits(['add-sprint', 'duplicate-sprint', 'remove-sprint', 'update-theoretical-days'])

function getSprintLoadTone(cost) {
  if (cost >= props.tableInsights.averageSprintCost * 1.2) {
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }

  if (cost <= props.tableInsights.averageSprintCost * 0.8) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  return 'bg-amber-50 text-amber-700 border-amber-200'
}
</script>

<template>
  <section class="space-y-4">
    <Card class="w-full border-slate-200/80 bg-white/95 shadow-sm">
      <CardHeader class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <CardTitle class="text-3xl">Plan de charge par sprint</CardTitle>
          <CardDescription>
            Vue compacte type tableur pour voir l'ensemble du plan sans scroll horizontal.
          </CardDescription>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <p class="text-slate-500">Budget moyen / sprint</p>
            <p class="mt-1 font-semibold text-slate-900">{{ formatCompactCurrency(tableInsights.averageSprintCost) }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <p class="text-slate-500">Charge moyenne</p>
            <p class="mt-1 font-semibold text-slate-900">{{ formatNumber(tableInsights.averageSprintDays) }} j</p>
          </div>
          <Button class="rounded-xl px-5" @click="$emit('add-sprint')">Ajouter un sprint</Button>
        </div>
      </CardHeader>

      <CardContent class="space-y-3 pt-2">
        <div class="grid gap-2 text-xs xl:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span class="text-slate-500">Sprint le plus engageant</span>
            <span class="ml-2 font-semibold text-slate-900">{{ tableInsights.peakSprintName }}</span>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span class="text-slate-500">Metiers</span>
            <span class="ml-2 font-semibold text-slate-900">{{ project.roles.length }}</span>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span class="text-slate-500">Charge totale</span>
            <span class="ml-2 font-semibold text-slate-900">{{ formatNumber(totals.realisticDays) }} j</span>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white">
          <table class="w-full table-fixed text-xs">
            <thead class="bg-white text-slate-600 shadow-[0_1px_0_0_rgb(226,232,240)]">
              <tr>
                <th class="w-[13%] px-2 py-3 text-left font-medium">Sprint</th>
                <th class="w-[8%] px-2 py-3 text-left font-medium">Debut</th>
                <th class="w-[8%] px-2 py-3 text-left font-medium">Fin</th>
                <th class="w-[6%] px-2 py-3 text-center font-medium">Theorique</th>
                <th class="w-[6%] px-2 py-3 text-center font-medium">Realiste</th>
                <th
                  v-for="role in project.roles"
                  :key="role.id"
                  class="px-2 py-3 text-center font-medium"
                >
                  <div class="space-y-0.5 leading-tight">
                    <p>{{ role.shortName || role.name }}</p>
                    <p class="truncate text-[10px] font-normal text-slate-400">{{ role.name }}</p>
                  </div>
                </th>
                <th class="w-[8%] px-2 py-3 text-right font-medium">Budget</th>
                <th class="w-[8%] px-2 py-3 text-right font-medium">Cumule</th>
                <th class="w-[8%] px-2 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="row in rows"
                :key="row.id"
                class="border-b border-slate-200 align-top transition hover:bg-slate-50/80"
              >
                <td class="p-2">
                  <div class="space-y-2">
                    <Input
                      v-model="project.sprints[row.index].name"
                      class="h-9 rounded-lg border-slate-300 bg-white px-2.5 text-xs font-medium"
                    />
                    <div class="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                      <span>{{ formatDateDisplay(project.sprints[row.index].start) }}</span>
                      <span>{{ formatDateDisplay(project.sprints[row.index].end) }}</span>
                      <span class="rounded-full border px-2 py-0.5 font-medium" :class="getSprintLoadTone(row.cost)">
                        {{ formatCompactCurrency(row.cost) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <Input
                    v-model="project.sprints[row.index].start"
                    type="date"
                    class="h-9 rounded-lg border-slate-300 bg-slate-50 px-2 text-xs"
                    @change="$emit('update-theoretical-days', project.sprints[row.index])"
                  />
                </td>
                <td class="p-2">
                  <Input
                    v-model="project.sprints[row.index].end"
                    type="date"
                    class="h-9 rounded-lg border-slate-300 bg-slate-50 px-2 text-xs"
                    @change="$emit('update-theoretical-days', project.sprints[row.index])"
                  />
                </td>
                <td class="p-2">
                  <Input
                    v-model.number="project.sprints[row.index].theoreticalDays"
                    type="number"
                    min="0"
                    step="0.5"
                    class="h-9 rounded-lg border-slate-300 bg-slate-50 px-2 text-center text-xs"
                  />
                </td>
                <td class="p-2">
                  <Input
                    v-model.number="project.sprints[row.index].realisticDays"
                    type="number"
                    min="0"
                    step="0.5"
                    class="h-9 rounded-lg border-slate-300 bg-slate-50 px-2 text-center text-xs"
                  />
                </td>
                <td v-for="role in project.roles" :key="`${row.id}-${role.id}`" class="p-2">
                  <div class="space-y-1">
                    <Input
                      v-model.number="project.sprints[row.index].allocations[role.id]"
                      type="number"
                      min="0"
                      step="0.25"
                      class="h-9 rounded-lg border-slate-300 bg-slate-50 px-1 text-center text-xs"
                    />
                    <p class="text-center text-[10px] text-slate-400">
                      {{ formatNumber(row.roleDays[role.id]) }}j
                    </p>
                  </div>
                </td>
                <td class="p-2 text-right align-middle font-semibold text-slate-900">
                  {{ formatCompactCurrency(row.cost) }}
                </td>
                <td class="bg-slate-50/50 p-2 text-right align-middle font-semibold text-primary">
                  {{ formatCompactCurrency(row.cumulative) }}
                </td>
                <td class="p-2 align-middle">
                  <div class="flex flex-col gap-1">
                    <Button variant="secondary" size="sm" class="h-8 rounded-lg px-2 text-[11px]" @click="$emit('duplicate-sprint', row.index)">
                      Dupl.
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      class="h-8 rounded-lg px-2 text-[11px]"
                      :disabled="project.sprints.length === 1"
                      @click="$emit('remove-sprint', row.index)"
                    >
                      Suppr.
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>

            <tfoot class="bg-slate-50 font-medium">
              <tr>
                <td class="px-2 py-3">Total</td>
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3 text-center">{{ formatNumber(totals.theoreticalDays) }}</td>
                <td class="px-2 py-3 text-center">{{ formatNumber(totals.realisticDays) }}</td>
                <td v-for="role in project.roles" :key="`total-${role.id}`" class="px-2 py-3 text-center">
                  {{ formatNumber(totals.roleTotals[role.id]) }}
                </td>
                <td class="px-2 py-3 text-right">{{ formatCompactCurrency(totals.cost) }}</td>
                <td class="px-2 py-3 text-right text-primary">{{ formatCompactCurrency(totals.cost) }}</td>
                <td class="px-2 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
