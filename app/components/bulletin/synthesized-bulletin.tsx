import { useState, useEffect } from "react";
import { Bulletin } from "../../stores/bulletin";
import type { Language } from "../../appStore";

const ENABLED_LANGUAGES: Language[] = ["de", "en", "it"];

/** The synthesized-bulletin mp3 URL for this bulletin, or null when no audio is
 *  available. The "Hören" button and the audio player live in different DOM
 *  places, so the URL is exposed as a hook and the UI is rendered by the caller.
 *  The URL is probed (HEAD) before it is returned: an enabled language is not
 *  enough, the file must actually exist. When it does not (off-season, region
 *  without synthesis), the caller renders neither the button nor a dead player. */
export function useSynthesizedBulletinUrl(
  date: Temporal.PlainDate,
  bulletin: Bulletin
): string | null {
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);

  useEffect(() => {
    setAudioFileUrl(null);
    if (!bulletin || !ENABLED_LANGUAGES.includes(bulletin.lang as Language)) {
      return;
    }

    const url = config.template(config.apis.bulletin.mp3, {
      date,
      region: bulletin.bulletinID,
      lang: bulletin.lang
    });

    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then(res => {
        if (!cancelled) setAudioFileUrl(res.ok ? url : null);
      })
      .catch(() => {
        if (!cancelled) setAudioFileUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [bulletin, date]);

  return audioFileUrl;
}
