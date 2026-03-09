import { round } from '@/lib/estimator/math'

export function computeRows(project) {
  let cumulative = 0

  return project.sprints.map((sprint, index) => {
    const roleDays = Object.fromEntries(
      project.roles.map((role) => [
        role.id,
        round((Number(sprint.realisticDays) || 0) * (Number(sprint.allocations[role.id]) || 0)),
      ]),
    )

    const cost = round(
      project.roles.reduce((total, role) => {
        const allocation = Number(sprint.allocations[role.id]) || 0
        const days = Number(sprint.realisticDays) || 0
        return total + days * allocation * (Number(role.rate) || 0)
      }, 0),
    )

    cumulative = round(cumulative + cost)

    return {
      ...sprint,
      index,
      roleDays,
      cost,
      cumulative,
    }
  })
}

export function computeTotals(project, rows) {
  const roleTotals = Object.fromEntries(project.roles.map((role) => [role.id, 0]))

  const summary = rows.reduce(
    (accumulator, row) => {
      accumulator.theoreticalDays += Number(row.theoreticalDays) || 0
      accumulator.realisticDays += Number(row.realisticDays) || 0
      accumulator.cost += Number(row.cost) || 0

      for (const role of project.roles) {
        roleTotals[role.id] += Number(row.roleDays[role.id]) || 0
      }

      return accumulator
    },
    { theoreticalDays: 0, realisticDays: 0, cost: 0 },
  )

  return {
    ...summary,
    sprintCount: project.sprints.length,
    cost: round(summary.cost),
    roleTotals: Object.fromEntries(
      Object.entries(roleTotals).map(([key, value]) => [key, round(value)]),
    ),
  }
}

export function computeProjectSummaries(projects) {
  return projects.map((project) => {
    const rows = computeRows(project)
    return {
      id: project.id,
      name: project.name,
      sprintCount: project.sprints.length,
      roleCount: project.roles.length,
      total: rows.at(-1)?.cumulative ?? 0,
    }
  })
}

export function computeTableInsights(project, rows, totals) {
  if (!project || rows.length === 0) {
    return {
      averageSprintCost: 0,
      averageSprintDays: 0,
      peakSprintName: '-',
      peakSprintCost: 0,
    }
  }

  const peakSprint = rows.reduce((highest, row) => (row.cost > highest.cost ? row : highest), rows[0])

  return {
    averageSprintCost: round(totals.cost / rows.length),
    averageSprintDays: round(totals.realisticDays / rows.length),
    peakSprintName: peakSprint.name,
    peakSprintCost: peakSprint.cost,
  }
}
