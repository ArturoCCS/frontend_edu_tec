export function buildCalendar(startDate, totalWeeks, history, activeWeek = 0) {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (totalWeeks * 7 - 1) * 86400000);

  const months = [];
  const cursor = new Date(start);
  cursor.setDate(1);
  while (cursor <= end) {
    months.push({ month: cursor.getMonth(), year: cursor.getFullYear() });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const eventsByDay = new Map();
  history.forEach(sem => {
    if (sem.week > activeWeek) return;
    sem.eventos.forEach((ev, idx) => {
      const dayOffset = (idx % 7);
      const baseDay = new Date(start.getTime() + sem.week * 7 * 86400000 + dayOffset * 86400000);
      const key = baseDay.toISOString().split('T')[0];
      eventsByDay.set(key, (eventsByDay.get(key) || 0) + 1);
    });
  });

  const calendars = [];
  months.forEach(mInfo => {
    const firstOfMonth = new Date(mInfo.year, mInfo.month, 1);
    const lastOfMonth = new Date(mInfo.year, mInfo.month + 1, 0);
    const startWeekDay = (firstOfMonth.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startWeekDay; i++) {
      const d = new Date(firstOfMonth.getTime() - (startWeekDay - i) * 86400000);
      days.push(buildDay(d, false, start, totalWeeks, eventsByDay, activeWeek));
    }
    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
      const date = new Date(mInfo.year, mInfo.month, d);
      days.push(buildDay(date, true, start, totalWeeks, eventsByDay, activeWeek));
    }
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const next = new Date(last.getTime() + 86400000);
      days.push(buildDay(next, false, start, totalWeeks, eventsByDay, activeWeek));
    }

    calendars.push({ month: mInfo.month, year: mInfo.year, days });
  });

  return calendars;
}

function buildDay(date, inMonth, start, totalWeeks, eventsByDay, activeWeek) {
  const diffDays = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const weekIndex = (diffDays >= 0 && diffDays < totalWeeks * 7) ? Math.floor(diffDays / 7) : null;
  const key = date.toISOString().split('T')[0];
  const events = eventsByDay.get(key) || 0;
  return {
    date,
    inMonth,
    weekIndex,
    events,
    isActiveWeek: weekIndex === activeWeek
  };
}