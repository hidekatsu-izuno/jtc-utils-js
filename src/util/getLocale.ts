const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export function getLocale() {
  return locale;
}
