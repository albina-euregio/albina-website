import { createRouter, redirectPage } from "@nanostores/router";

export const $router = createRouter({
  home: "/",
  bulletin: "/bulletin",
  bulletinDate: "/bulletin/:date",
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
  redirectPage($router, router?.route, router?.params, search);
}
