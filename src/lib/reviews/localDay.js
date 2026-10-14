// Browser helpers for review dates. Schedules use the student's LOCAL calendar day
// ('YYYY-MM-DD'), so cards turn due at their midnight, not the server's.

const pad = (n) => String(n).padStart(2, '0');

export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// whole days from `today` to `day` (both 'YYYY-MM-DD')
export function daysBetween(today, day) {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

// "today", "tomorrow", "in 3 days"
export function whenDue(today, day) {
  const n = daysBetween(today, day);
  if (n <= 0) return 'today';
  if (n === 1) return 'tomorrow';
  return `in ${n} days`;
}
