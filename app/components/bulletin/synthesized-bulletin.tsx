/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { dateToISODateString } from "../../util/date.js";
import { Bulletin } from "../../stores/bulletin";

type Props = { date: Date; bulletin: Bulletin };

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  useEffect(() => {
    const checkAudioFile = (date: Date, bulletin: Bulletin) => {
      const fileUrl =
        "https://static.avalanche.report/synthesizer/bulletins/" +
        dateToISODateString(date) +
        "/" +
        bulletin.bulletinID +
        "_" +
        bulletin.lang +
        ".mp3";

      fetch(fileUrl, { method: "HEAD" })
        .then(res => {
          if (res.status == 200) {
            setAudioFileUrl(fileUrl);
          } else {
            setAudioFileUrl(null);
          }
        })
        .catch(() => {
          setAudioFileUrl(null);
        });
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
export default observer(SynthesizedBulletin);
