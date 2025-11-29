import { createRouter } from "@nanostores/router";

const projectRoot = import.meta.env.BASE_URL;

export const $router = createRouter({
  home: `${projectRoot}`,
  bulletin: `${projectRoot}bulletin`,
  bulletinDate: `${projectRoot}bulletin/:date`,
  bulletinLatest: `${projectRoot}bulletin/latest`,
  weather: `${projectRoot}weather`,
  weatherMap: `${projectRoot}weather/map/`,
  weatherMapDomain: `${projectRoot}weather/map/:domain`,
  weatherMapDomainTimestamp: `${projectRoot}weather/map/:domain/:timestamp`,
  weatherArchive: `${projectRoot}weather/archive`,
  weatherMeasurements: `${projectRoot}weather/measurements`,
  weatherStations: `${projectRoot}weather/stations`,
  weatherSnowProfiles: `${projectRoot}weather/snow-profiles`,
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
