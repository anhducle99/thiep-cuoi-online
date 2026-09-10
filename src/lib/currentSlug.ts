export function getCurrentSlug(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const segments = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
  const first = segments[0];
  if (!first || first === "admin" || first.startsWith("api") || first.startsWith("_next")) return undefined;
  return first;
}
