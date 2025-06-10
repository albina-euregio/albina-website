export function newRegionRegex(regions: string[]): RegExp {
  return new RegExp("^(" + regions.join("|") + ")");
}
