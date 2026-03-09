import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from '@/lib/estimator/config'
import { createProject, normalizeProject } from '@/lib/estimator/models'

export function loadEstimatorState() {
  const fallbackProject = createProject()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return parseProjectsState(JSON.parse(raw), fallbackProject)
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacyRaw = localStorage.getItem(key)
      if (!legacyRaw) {
        continue
      }

      return parseProjectsState(JSON.parse(legacyRaw), fallbackProject)
    }
  } catch {
    return createFallbackState(fallbackProject)
  }

  return createFallbackState(fallbackProject)
}

export function persistEstimatorState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function parseProjectsState(parsed, fallbackProject) {
  if (Array.isArray(parsed?.projects)) {
    const projects = parsed.projects.map(normalizeProject)
    const selectedProjectId =
      projects.find((project) => project.id === parsed.selectedProjectId)?.id ?? projects[0]?.id

    return {
      projects: projects.length > 0 ? projects : [fallbackProject],
      selectedProjectId: selectedProjectId || fallbackProject.id,
    }
  }

  return createFallbackState(fallbackProject)
}

function createFallbackState(fallbackProject) {
  return {
    projects: [fallbackProject],
    selectedProjectId: fallbackProject.id,
  }
}
