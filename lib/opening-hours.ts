/** Horários do Strike Beer (fuso America/Sao_Paulo) */
export function isStrikeBeerOpen(now: Date = new Date()): boolean {
  const { day, minutes } = getSaoPauloDayAndMinutes(now);

  // Seg — Qui: 18h às 01h
  if (day >= 1 && day <= 4) {
    return minutes >= 18 * 60 || minutes < 1 * 60;
  }

  // Sex — Sáb: 18h às 03h
  if (day === 5 || day === 6) {
    return minutes >= 18 * 60 || minutes < 3 * 60;
  }

  // Domingo: 17h às 00h (até meia-noite)
  if (day === 0) {
    return minutes >= 17 * 60;
  }

  return false;
}

function getSaoPauloDayAndMinutes(now: Date): { day: number; minutes: number } {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(now);

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  return {
    day: dayMap[weekday] ?? 0,
    minutes: hour * 60 + minute,
  };
}
