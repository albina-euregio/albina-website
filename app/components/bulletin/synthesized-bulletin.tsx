/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useState, useEffect } from "react";
import { dateToISODateString } from "../../util/date";
import { Bulletin } from "../../stores/bulletin";

type Props = { date: Date; bulletin: Bulletin };

const ENABLED_LANGUAGES = ["de", "en"];

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  useEffect(() => {
    if (!ENABLED_LANGUAGES.includes(bulletin.lang)) {
      setAudioFileUrl(null);
      return;
    }

    setAudioFileUrl(
      config.template(config.apis.bulletin.mp3, {
        date: dateToISODateString(date),
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
