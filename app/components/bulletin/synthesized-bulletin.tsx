/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useState, useEffect } from "react";
import { dateToISODateString } from "../../util/date";
import { Bulletin } from "../../stores/bulletin";
import { fetchExists } from "../../util/fetch";

type Props = { date: Date; bulletin: Bulletin };

const ENABLED_LANGUAGES = ["de", "en"];

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  useEffect(() => {
    const checkAudioFile = async (date: Date, bulletin: Bulletin) => {
      if (!ENABLED_LANGUAGES.includes(bulletin.lang)) {
        setAudioFileUrl(null);
        return;
      }
      const fileUrl = config.template(config.apis.bulletin.mp3, {
        date: dateToISODateString(date),
        region: bulletin.bulletinID + "_",
        lang: bulletin.lang
      });

      const ok = await fetchExists(fileUrl);
      setAudioFileUrl(ok ? fileUrl : null);
    };
    checkAudioFile(date, bulletin);
  }, [bulletin, date]);

  return (
    <div className="synthesizedReport">
      {audioFileUrl && (
        <div>
          <audio controls={true} src={audioFileUrl}>
            <a href={audioFileUrl}></a>
          </audio>
        </div>
      )}
    </div>
  );
}
export default SynthesizedBulletin;
