import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: "/",
  bulletin: "/bulletin",
  bulletinDate: "/bulletin/:date",
  bulletinLatest: "/bulletin/latest",
  weather: "/weather",
  weatherMap: "/weather/map/",
  weatherMapDomain: "/weather/map/:domain",
  weatherMapDomainTimestamp: "weather/map/:domain/:timestamp",
  weatherArchive: "/weather/archive",
  weatherMeasurements: "/weather/measurements",
  weatherStations: "/weather/stations",
  weatherSnowProfiles: "/weather/snow-profiles",
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
