interface Window {
  appStore: import("../appStore").default;
  archiveStore: import("./archiveStore").default;
  blogStore: import("./blogStore").default;
  bulletinStore: import("./bulletinStore").BulletinStore;
  mapStore: import("./mapStore").default;
  modalStateStore: import("./modalStateStore").default;
  staticPageStore: import("./staticPageStore").default;
  stationDataStore: import("./stationDataStore").default;
}
