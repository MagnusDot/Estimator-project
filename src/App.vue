<script setup>
import { ref } from 'vue'
import ProjectHero from '@/components/estimator/ProjectHero.vue'
import ProjectSummary from '@/components/estimator/ProjectSummary.vue'
import ProjectSwitcher from '@/components/estimator/ProjectSwitcher.vue'
import SprintPlanTable from '@/components/estimator/SprintPlanTable.vue'
import TeamEditor from '@/components/estimator/TeamEditor.vue'
import { useEstimatorState } from '@/composables/useEstimatorState'

const {
  state,
  activeProject,
  rows,
  totals,
  projectSummaries,
  tableInsights,
  addProject,
  duplicateProject,
  removeProject,
  addRole,
  removeRole,
  moveRole,
  addSprint,
  duplicateSprint,
  removeSprint,
  updateTheoreticalDaysFromDates,
} = useEstimatorState()

const isTeamEditorOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="min-h-screen space-y-4 px-2 py-4">
      <main v-if="activeProject" class="space-y-4">
        <ProjectSwitcher
          :active-project="activeProject"
          :project-summaries="projectSummaries"
          :project-count="state.projects.length"
          @select-project="state.selectedProjectId = $event"
          @add-project="addProject"
          @duplicate-project="duplicateProject"
          @remove-project="removeProject"
        />

        <ProjectHero
          :project="activeProject"
          :totals="totals"
        />

        <section>
          <ProjectSummary
            :project="activeProject"
            :totals="totals"
          />
        </section>

        <SprintPlanTable
          :project="activeProject"
          :rows="rows"
          :totals="totals"
          :table-insights="tableInsights"
          @add-sprint="addSprint"
          @duplicate-sprint="duplicateSprint"
          @remove-sprint="removeSprint"
          @update-theoretical-days="updateTheoreticalDaysFromDates"
        />
      </main>

      <TeamEditor
        v-if="activeProject"
        :open="isTeamEditorOpen"
        :project="activeProject"
        @close="isTeamEditorOpen = false"
        @add-role="addRole"
        @remove-role="removeRole"
        @move-role="moveRole"
      />

      <button
        v-if="activeProject"
        type="button"
        class="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:border-primary/30 hover:bg-white hover:text-primary hover:shadow-xl"
        :aria-label="isTeamEditorOpen ? 'Fermer le panneau equipe projet' : 'Ouvrir le panneau equipe projet'"
        :title="isTeamEditorOpen ? 'Fermer equipe projet' : 'Ouvrir equipe projet'"
        @click="isTeamEditorOpen = !isTeamEditorOpen"
      >
        <svg
          v-if="!isTeamEditorOpen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          class="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M40-160v-112q0-34 17.5-62.5T105-378q62-31 126-46.5T360-440q65 0 129 15.5T615-378q30 15 47.5 43.5T680-272v112H40Zm720 0v-112q0-45-17.5-85.5T692-426q41 8 80 21.5t75 32.5q30 15 51.5 45T920-272v112H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm360-160q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          class="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M200-440v-80h560v80H200Z" />
        </svg>
      </button>
    </div>
  </div>
</template>
