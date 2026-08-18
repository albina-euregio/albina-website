import { createRouter } from "@nanostores/router";

const projectRoot = import.meta.env.BASE_URL as "/" | "/beta/" | "/dev/";

export const $router = createRouter({
  home: `${projectRoot}`,
  bulletin: `${projectRoot}bulletin`,
  bulletinDate: `${projectRoot}bulletin/:date`,
  bulletinLatest: `${projectRoot}bulletin/latest`,
  incidents: `${projectRoot}incidents`,
  snowProfiles: `${projectRoot}profiles`,
  weather: `${projectRoot}weather`,
  weatherMap: `${projectRoot}weather/map/`,
  weatherMapDomain: `${projectRoot}weather/map/:domain`,
  weatherMapDomainTimestamp: `${projectRoot}weather/map/:domain/:timestamp/:timeSpan?`,
  weatherArchive: `${projectRoot}weather/archive`,
  weatherMeasurements: `${projectRoot}weather/measurements`,
  weatherStations: `${projectRoot}weather/stations`,
  conditions: `${projectRoot}conditions`,
  conditionsProfiles: `${projectRoot}conditions/profiles`,
  terrain: `${projectRoot}terrain`,
  education: `${projectRoot}education`,
  blogNamePost: `${projectRoot}blog/:blogName/:postId`,
  blogTech: `${projectRoot}blog/tech`,
  blog: `${projectRoot}blog`,
  more: `${projectRoot}more`,
  moreArchive: `${projectRoot}more/archive`,
  moreLinkTree: `${projectRoot}more/linktree`,
  archive: `${projectRoot}archive`,
  educationStar: `${projectRoot}education/*`,
  staticName: `${projectRoot}:name`,
  staticSegmentName: `${projectRoot}:segment/:name`
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
