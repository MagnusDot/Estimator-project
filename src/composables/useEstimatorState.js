import { computed, reactive, watch } from 'vue'
import { addDays, addWorkingDays, countWorkingDaysInclusive } from '@/lib/date'
import { createProject, createRole, createSprint, normalizeProject } from '@/lib/estimator/models'
import {
  computeProjectSummaries,
  computeRows,
  computeTableInsights,
  computeTotals,
} from '@/lib/estimator/selectors'
import { loadEstimatorState, persistEstimatorState } from '@/lib/estimator/storage'

export function useEstimatorState() {
  const state = reactive(loadEstimatorState())

  const activeProject = computed(
    () => state.projects.find((project) => project.id === state.selectedProjectId) ?? state.projects[0],
  )

  const rows = computed(() => {
    const project = activeProject.value
    return project ? computeRows(project) : []
  })

  const totals = computed(() => {
    const project = activeProject.value
    return project ? computeTotals(project, rows.value) : emptyTotals()
  })

  const projectSummaries = computed(() => computeProjectSummaries(state.projects))

  const tableInsights = computed(() => computeTableInsights(activeProject.value, rows.value, totals.value))

  watch(
    state,
    (value) => {
      persistEstimatorState(value)
    },
    { deep: true },
  )

  function addProject() {
    const project = createProject({
      name: `Projet ${state.projects.length + 1}`,
    })
    state.projects.push(project)
    state.selectedProjectId = project.id
  }

  function duplicateProject(projectId) {
    const source = state.projects.find((project) => project.id === projectId)
    if (!source) {
      return
    }

    const clone = normalizeProject({
      ...structuredClone(source),
      id: crypto.randomUUID(),
      name: `${source.name} copie`,
    })

    state.projects.push(clone)
    state.selectedProjectId = clone.id
  }

  function removeProject(projectId) {
    if (state.projects.length === 1) {
      return
    }

    const index = state.projects.findIndex((project) => project.id === projectId)
    if (index === -1) {
      return
    }

    state.projects.splice(index, 1)

    if (state.selectedProjectId === projectId) {
      state.selectedProjectId = state.projects[Math.max(index - 1, 0)].id
    }
  }

  function addRole() {
    const project = activeProject.value
    if (!project) {
      return
    }

    const role = createRole({
      name: `Metier ${project.roles.length + 1}`,
      shortName: `Role ${project.roles.length + 1}`,
    })

    project.roles.push(role)
    for (const sprint of project.sprints) {
      sprint.allocations[role.id] = 0
    }
  }

  function removeRole(roleId) {
    const project = activeProject.value
    if (!project || project.roles.length === 1) {
      return
    }

    project.roles = project.roles.filter((role) => role.id !== roleId)
    for (const sprint of project.sprints) {
      delete sprint.allocations[roleId]
    }
  }

  function moveRole(roleId, direction) {
    const project = activeProject.value
    if (!project) {
      return
    }

    const index = project.roles.findIndex((role) => role.id === roleId)
    if (index === -1) {
      return
    }

    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= project.roles.length) {
      return
    }

    const [role] = project.roles.splice(index, 1)
    project.roles.splice(targetIndex, 0, role)
  }

  function addSprint() {
    const project = activeProject.value
    if (!project) {
      return
    }

    const lastSprint = project.sprints.at(-1)
    const sprintNumber = project.sprints.length + 1
    const nextStart = lastSprint?.end ? addDays(lastSprint.end, 3) : ''

    project.sprints.push(
      createSprint(project.roles, {
        name: `Sprint ${sprintNumber}`,
        start: nextStart,
        end: nextStart ? addWorkingDays(nextStart, Number(lastSprint?.theoreticalDays) || 10) : '',
        theoreticalDays: Number(lastSprint?.theoreticalDays) || 10,
        realisticDays: Number(lastSprint?.realisticDays) || 8,
        allocations: Object.fromEntries(
          project.roles.map((role) => [role.id, Number(lastSprint?.allocations?.[role.id]) || 0]),
        ),
      }),
    )
  }

  function duplicateSprint(index) {
    const project = activeProject.value
    if (!project) {
      return
    }

    const source = project.sprints[index]
    project.sprints.splice(
      index + 1,
      0,
      createSprint(project.roles, {
        ...structuredClone(source),
        id: crypto.randomUUID(),
        name: `${source.name} copie`,
      }),
    )
  }

  function removeSprint(index) {
    const project = activeProject.value
    if (!project || project.sprints.length === 1) {
      return
    }

    project.sprints.splice(index, 1)
  }

  function updateTheoreticalDaysFromDates(sprint) {
    if (!sprint.start || !sprint.end) {
      return
    }

    sprint.theoreticalDays = countWorkingDaysInclusive(sprint.start, sprint.end)
  }

  return {
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
  }
}

function emptyTotals() {
  return { theoreticalDays: 0, realisticDays: 0, cost: 0, sprintCount: 0, roleTotals: {} }
}
