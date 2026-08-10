import { useState, useEffect } from "react";
import { Bulletin } from "../../stores/bulletin";
import type { Language } from "../../appStore";

const ENABLED_LANGUAGES: Language[] = ["de", "en", "it"];

/** The synthesized-bulletin mp3 URL for this bulletin, or null when the language
 *  has no synthesized audio. The "Hören" button and the audio player live in
 *  different DOM places, so the URL is exposed as a hook and the UI is rendered
 *  by the caller. Availability is language-based only; a missing mp3 leaves the
 *  player in its native error state rather than removing the button. */
export function useSynthesizedBulletinUrl(
  date: Temporal.PlainDate,
  bulletin: Bulletin
): string | null {
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

  return audioFileUrl;
}
