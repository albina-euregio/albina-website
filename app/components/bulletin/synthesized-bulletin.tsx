import React from "react";
import { useState, useEffect } from "react";
import { Bulletin } from "../../stores/bulletin";
import type { Language } from "../../appStore";

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
}

const ENABLED_LANGUAGES: Language[] = ["de", "en", "it"];

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  useEffect(() => {
    if (!ENABLED_LANGUAGES.includes(bulletin.lang as Language)) {
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

  return (
    <div className="synthesizedReport">
      {audioFileUrl && (
        <div>
          <audio
            controls={true}
            src={audioFileUrl}
            onError={() => setAudioFileUrl(null)}
          >
            <a href={audioFileUrl}></a>
          </audio>
        </div>
      )}
    </div>
  );
}
export default SynthesizedBulletin;
