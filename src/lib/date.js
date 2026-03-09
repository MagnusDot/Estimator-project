export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toInputDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(dateString, days) {
  const date = parseLocalDate(dateString)
  date.setDate(date.getDate() + days)
  return toInputDate(date)
}

export function addWorkingDays(dateString, workingDays) {
  const date = parseLocalDate(dateString)
  let remaining = Math.max((Number(workingDays) || 1) - 1, 0)

  while (remaining > 0) {
    date.setDate(date.getDate() + 1)
    const weekday = date.getDay()
    if (weekday !== 0 && weekday !== 6) {
      remaining -= 1
    }
  }

  return toInputDate(date)
}

export function countWorkingDaysInclusive(start, end) {
  const startDate = parseLocalDate(start)
  const endDate = parseLocalDate(end)

  if (endDate < startDate) {
    return 0
  }

  let total = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) {
      total += 1
    }
    current.setDate(current.getDate() + 1)
  }

  return total
}
