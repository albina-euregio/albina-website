import { createRouter } from "@nanostores/router";
import { onMount } from "nanostores";

const projectRoot = import.meta.env.BASE_URL as "/" | "/beta/" | "/dev/";

export const $router = createRouter(
  {
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
  },
  { links: false } // override click handler to handle projectRoot
);

function click(event: MouseEvent) {
  let link = (event.target as HTMLElement).closest("a");
  if (
    link &&
    event.button === 0 && // Left mouse button
    link.target !== "_blank" && // Not for new tab
    link.origin === location.origin && // Not external link
    link.rel !== "external" && // Not external link
    link.target !== "_self" && // Now manually disabled
    !link.download && // Not download link
    !event.altKey && // Not download link by user
    !event.metaKey && // Not open in new tab by user
    !event.ctrlKey && // Not open in new tab by user
    !event.shiftKey && // Not open in new window by user
    !event.defaultPrevented // Click was not cancelled
  ) {
    event.preventDefault();
    const hashChanged = location.hash !== link.hash;
    const href =
      link.href.startsWith(new URL(projectRoot, location.href).toString()) ||
      !link.href.startsWith(new URL("/", location.href).toString())
        ? link.href
        : projectRoot + link.pathname.slice(1);
    $router.open(href);
    if (hashChanged) {
      location.hash = link.hash;
      if (link.hash === "" || link.hash === "#") {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    }
  }
}

onMount($router, () => {
  document.body.addEventListener("click", click);
  return () => document.body.removeEventListener("click", click);
});
