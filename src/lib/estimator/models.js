import { DEFAULT_ROLE_TEMPLATES } from '@/lib/estimator/config'

export function createRole(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Nouveau metier',
    shortName: 'Role',
    rate: 650,
    ...overrides,
  }
}

export function createSprint(roleList, overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Nouveau sprint',
    start: '',
    end: '',
    theoreticalDays: 10,
    realisticDays: 8,
    allocations: Object.fromEntries(roleList.map((role) => [role.id, 0])),
    ...overrides,
  }
}

export function createSeedSprints(roleList) {
  const map = (values) => Object.fromEntries(roleList.map((role) => [role.id, values[role.id] ?? 0]))

  return [
    createSprint(roleList, {
      name: 'Sprint 1 (cadrage)',
      start: '2026-07-06',
      end: '2026-07-24',
      theoreticalDays: 14,
      realisticDays: 12,
      allocations: map({ sm: 1, designer: 1, techLead: 1, leadDev: 1, developer: 0, devops: 1 }),
    }),
    createSprint(roleList, {
      name: 'Sprint 2',
      start: '2026-07-27',
      end: '2026-08-14',
      theoreticalDays: 15,
      realisticDays: 13,
      allocations: map({ sm: 1, designer: 0.5, techLead: 0.25, leadDev: 1, developer: 1, devops: 0 }),
    }),
    createSprint(roleList, {
      name: 'Sprint 3',
      start: '2026-08-17',
      end: '2026-09-04',
      theoreticalDays: 15,
      realisticDays: 13,
      allocations: map({ sm: 1, designer: 0.5, techLead: 0.25, leadDev: 1, developer: 1, devops: 0 }),
    }),
    createSprint(roleList, {
      name: 'Sprint 4',
      start: '2026-09-07',
      end: '2026-09-25',
      theoreticalDays: 15,
      realisticDays: 13,
      allocations: map({ sm: 1, designer: 0, techLead: 0.25, leadDev: 1, developer: 1, devops: 0 }),
    }),
    createSprint(roleList, {
      name: 'Sprint 5',
      start: '2026-09-28',
      end: '2026-10-16',
      theoreticalDays: 15,
      realisticDays: 13,
      allocations: map({ sm: 0.5, designer: 0, techLead: 0.25, leadDev: 1, developer: 1, devops: 0.5 }),
    }),
    createSprint(roleList, {
      name: 'Sprint 6',
      start: '2026-10-19',
      end: '2026-11-06',
      theoreticalDays: 15,
      realisticDays: 13,
      allocations: map({ sm: 0.5, designer: 0, techLead: 0, leadDev: 0.5, developer: 1, devops: 0 }),
    }),
  ]
}

export function createProject(overrides = {}) {
  const roles = DEFAULT_ROLE_TEMPLATES.map((role) => createRole(role))

  return {
    id: crypto.randomUUID(),
    name: 'Projet AO',
    clientName: 'Client / Programme',
    notes: '',
    roles,
    sprints: createSeedSprints(roles),
    ...overrides,
  }
}

export function normalizeRole(role, index) {
  return createRole({
    id: role?.id || crypto.randomUUID(),
    name: role?.name || role?.label || `Metier ${index + 1}`,
    shortName: role?.shortName || role?.label || `Role ${index + 1}`,
    rate: Number(role?.rate) || 650,
  })
}

export function normalizeProject(project) {
  const legacyRates = project?.rates || {}
  const roles = Array.isArray(project?.roles)
    ? project.roles.map(normalizeRole)
    : DEFAULT_ROLE_TEMPLATES.map((role) =>
        createRole({
          id: role.id,
          name: role.name,
          shortName: role.shortName,
          rate: Number(legacyRates[role.id]) || role.rate,
        }),
      )

  const sprints =
    project?.sprints?.map((sprint) =>
      createSprint(roles, {
        ...sprint,
        id: sprint?.id || crypto.randomUUID(),
        allocations: Object.fromEntries(
          roles.map((role) => [role.id, Number(sprint?.allocations?.[role.id]) || 0]),
        ),
      }),
    ) ?? []

  return {
    id: project?.id || crypto.randomUUID(),
    name: project?.name || project?.clientName || 'Projet sans nom',
    clientName: project?.clientName || 'Client / Programme',
    notes: project?.notes || '',
    roles,
    sprints: sprints.length > 0 ? sprints : createSeedSprints(roles),
  }
}
