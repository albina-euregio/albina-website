/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { dateToISODateString } from "../../util/date.js";
import { Bulletin } from "../../stores/bulletin";
import { useIntl } from "react-intl";

type Props = { date: Date; bulletin: Bulletin };

function SynthesizedBulletin({ date, bulletin }: Props) {
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    const checkAudioFile = (date: Date, bulletin: Bulletin) => {
      const fileUrl =
        "https://storage.googleapis.com/avalnache-podcast-audio/bulletins/" +
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

  const audioStyle = {
    alignItems: "center",
    display: "flex"
  };
  const paddingStyle = {
    marginRight: "20px"
  };

  return (
    <div className="synthesizedReport">
      {audioFileUrl && (
        <div style={audioStyle}>
          <audio style={paddingStyle} controls={true} src={audioFileUrl}>
            <a href={audioFileUrl}></a>
          </audio>
          <a
            href={
              "mailto:lawine@tirol.gv.at?subject=Lawinen.report%20-%20Feedback%20Synthesized%20Report&body=%0D%0A%0D%0A%0D%0A%0D%0A" +
              audioFileUrl +
              "%0D%0A(URL bitte im Email belassen.)"
            }
            className="secondary pure-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage({
              id: "bulletin:report:audio:feedback"
            })}
          </a>
        </div>
      )}
    </div>
  );
}
export default observer(SynthesizedBulletin);
