/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useState, useEffect } from "react";
import { dateToISODateString } from "../../util/date.js";
import { Bulletin } from "../../stores/bulletin";
import { fetchExists } from "../../util/fetch";

type Props = { date: Date; bulletin: Bulletin };

const ENABLED_LANGUAGES = ["de"];

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  useEffect(() => {
    const checkAudioFile = async (date: Date, bulletin: Bulletin) => {
      if (!ENABLED_LANGUAGES.includes(bulletin.lang)) {
        setAudioFileUrl(null);
        return;
      }
      const fileUrl =
        "https://static.avalanche.report/synthesizer/bulletins/" +
        dateToISODateString(date) +
        "/" +
        bulletin.bulletinID +
        "_" +
        bulletin.lang +
        ".mp3";

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
