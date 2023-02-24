import { Bulletin } from "../stores/bulletin";
import { BULLETIN_STORE } from "../stores/bulletinStore";
import { dateToISODateString } from "./date.js";

const tryRequire = path => {
  try {
    return require(`${path}`);
  } catch (err) {
    return null;
  }
};

export function existsAudioFile(b: Bulletin): boolean {
  if (import.meta.env.DEV || import.meta.env.BASE_URL === "/beta/") {
    return tryRequire(getAudioFilePath(b));
  } else {
    return false;
  }
}

export function getAudioFilePath(b: Bulletin): string {
  const path =
    "https://storage.googleapis.com/avalanche-report-audio/bulletins/" +
    dateToISODateString(BULLETIN_STORE.date) +
    "/EUREGIO_" +
    b.bulletinID +
    ".mp3";
  return path;
}
