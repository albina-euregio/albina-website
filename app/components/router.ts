import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: "/",
  homeDate: [/^\/(\d{4}-\d{2}-\d{2})$/i, date => ({ date })] as const,
  bulletin: "/bulletin",
  bulletinDate: [
    /^\/bulletin\/(\d{4}-\d{2}-\d{2})$/i,
    date => ({ date })
  ] as const,
  bulletinLatest: "/bulletin/latest",
  incidents: "/incidents",
  snowProfiles: "/profiles",
  weather: "/weather",
  weatherMap: "/weather/map/",
  weatherMapDomain: "/weather/map/:domain",
  weatherMapDomainTimestamp: "/weather/map/:domain/:timestamp",
  weatherArchive: "/weather/archive",
  weatherMeasurements: "/weather/measurements",
  weatherStations: "/weather/stations",
  conditions: "/conditions",
  conditionsProfiles: "/conditions/profiles",
  terrain: "/terrain",
  education: "/education",
  blogNamePost: "/blog/:blogName/:postId",
  blogTech: "/blog/tech",
  blog: "/blog",
  more: "/more",
  moreArchive: "/more/archive",
  moreLinkTree: "/more/linktree",
  archive: "/archive",
  educationStar: "/education/*",
  staticName: "/:name",
  staticSegmentName: "/:segment/:name"
});

export function redirectPageQuery(search: Record<string, string | number>) {
  const router = $router.get();
  search = {
    ...router?.search,
    ...search
  };
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  Object.entries(search).forEach(([k, v]) => v || delete search[k]);
  // Build the path from the current parsed pathname (router.path) instead of
  // reversing router.route via getPagePath/redirectPage: RegExp-based routes
  // (e.g. homeDate, bulletinDate) have no reversible path template and would
  // throw "RegExp routes are not supported".
  const path = router?.path ?? "/";
  const postfix = new URLSearchParams(
    search as Record<string, string>
  ).toString();
  $router.open(postfix ? `${path}?${postfix}` : path, true);
}
