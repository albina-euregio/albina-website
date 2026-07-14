import React from "react";
import { useState, useEffect } from "react";
import { Bulletin } from "../../stores/bulletin";
import type { Language } from "../../appStore";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip.tsx";

interface Props {
  date: Temporal.PlainDate;
  bulletin: Bulletin;
}

const ENABLED_LANGUAGES: Language[] = ["de", "en", "it"];

function SynthesizedBulletin({ date, bulletin }: Props) {
  const intl = useIntl();
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
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

  if (!audioFileUrl) return null;

  // "Hören" button toggles the player: clicking reveals the audio and hides the button.
  return (
    <li className="synthesizedReport">
      {playing ? (
        <audio
          controls={true}
          autoPlay={true}
          src={audioFileUrl}
          onError={() => setAudioFileUrl(null)}
        >
          <a href={audioFileUrl}></a>
        </audio>
      ) : (
        <Tooltip
          label={intl.formatMessage({ id: "bulletin:report:listen:hover" })}
        >
          <button
            type="button"
            className="pure-button inverse tooltip"
            onClick={() => setPlaying(true)}
          >
            <span className="icon icon-listen-small"></span>
            <FormattedMessage id="bulletin:report:listen" />
          </button>
        </Tooltip>
      )}
    </li>
  );
}
export default SynthesizedBulletin;
