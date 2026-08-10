import { useState, useEffect } from "react";
import { Bulletin } from "../../stores/bulletin";
import type { Language } from "../../appStore";

const ENABLED_LANGUAGES: Language[] = ["de", "en", "it"];

/** The synthesized-bulletin mp3 URL for this bulletin (or null when unavailable
 *  or the language has no audio), plus a callback to clear it on playback error.
 *  The "Hören" button and the audio player live in different DOM places, so the
 *  URL/availability is exposed as a hook and the UI is rendered by the caller. */
export function useSynthesizedBulletinUrl(
  date: Temporal.PlainDate,
  bulletin: Bulletin
): [string | null, () => void] {
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!bulletin || !ENABLED_LANGUAGES.includes(bulletin.lang as Language)) {
      setAudioFileUrl(null);
      return;
    }

    setAudioFileUrl(
      config.template(config.apis.bulletin.mp3, {
        date,
        region: bulletin.bulletinID,
        lang: bulletin.lang
      })
    );
  }, [bulletin, date]);

  return [audioFileUrl, () => setAudioFileUrl(null)];
}
