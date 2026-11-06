/** API base URL for `path`, using the region's own host from `config.apis.byRegion` if one is configured. */
export function regionApi(
  region: string | undefined,
  path: "blogs" | "incidents"
): string {
  const byRegion: Record<string, string> = config.apis.byRegion;
  const base = region ? byRegion[region] : undefined;
  return base ? `${base}/${path}` : config.apis[path];
}
