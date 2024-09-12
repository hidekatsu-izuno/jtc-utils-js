const current = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function getTimeZone() {
  return current;
}
