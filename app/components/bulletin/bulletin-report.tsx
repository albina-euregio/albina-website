import React from "react";
import { observer } from "mobx-react";
import { FormattedMessage, useIntl } from "react-intl";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport from "./bulletin-daytime-report";
import SynthesizedBulletin from "./synthesized-bulletin";
import { LONG_DATE_FORMAT } from "../../util/date";
import { preprocessContent } from "../../util/htmlParser";
import { getWarnlevelNumber } from "../../util/warn-levels";
import { findGlossaryStrings } from "./bulletin-glossary";
import {
  Bulletin,
  hasDaytimeDependency,
  getDangerPatterns
} from "../../stores/bulletin";
import { APP_STORE } from "../../appStore";

type Props = { date: Date; bulletin: Bulletin };

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 */
function BulletinReport({ date, bulletin }: Props) {
  const intl = useIntl();
  const dangerPatterns = getDangerPatterns(bulletin.customData);

  function getLocalizedText(elem: string | undefined) {
    // bulletins are loaded in correct language
    if (!elem) return "";
    elem = elem.replace(/&lt;br\/&gt;/g, "<br/>");
    if (import.meta.env.DEV || import.meta.env.BASE_URL === "/beta/") {
      const withGlossary = findGlossaryStrings(elem, APP_STORE.language);
      try {
        return preprocessContent(withGlossary);
      } catch (e) {
        console.warn(e, { elem, withGlossary });
      }
    }
    return preprocessContent(elem);
  }

  if (!bulletin || !bulletin) {
    return <div />;
  }

  const maxWarnlevel = bulletin.dangerRatings
    .map(r => r.mainValue)
    .reduce((v1, v2) =>
      getWarnlevelNumber(v1) > getWarnlevelNumber(v2) ? v1 : v2
    );
  const classes =
    "panel field callout warning-level-" + getWarnlevelNumber(maxWarnlevel);

  return (
    <div>
      <section
        id={bulletin.bulletinID + "-main"}
        className="section-centered section-bulletin section-bulletin-report"
      >
        <div className={classes}>
          <header className="bulletin-report-header">
            <p className="bulletin-report-header-meta">
              <span>
                <FormattedMessage
                  id="bulletin:report:headline"
                  values={{
                    strong: (...msg) => <strong>{msg}</strong>,
                    date: intl.formatDate(date, LONG_DATE_FORMAT),
                    daytime: ""
                  }}
                />
              </span>
            </p>
            <h1 className="bulletin-report-header-danger-level">
              <span>
                <FormattedMessage
                  id={
                    getWarnlevelNumber(maxWarnlevel) == 0
                      ? "bulletin:report:headline2:level0"
                      : "bulletin:report:headline2"
                  }
                  values={{
                    number: getWarnlevelNumber(maxWarnlevel),
                    text: intl.formatMessage({
                      id: "danger-level:" + maxWarnlevel
                    })
                  }}
                />
              </span>
            </h1>
            <SynthesizedBulletin
              date={date}
              bulletin={bulletin}
            ></SynthesizedBulletin>
          </header>
          {hasDaytimeDependency(bulletin) ? (
            [
              <BulletinDaytimeReport
                key={"am"}
                bulletin={bulletin}
                date={date}
                ampm={"am"}
              />,
              <BulletinDaytimeReport
                key={"pm"}
                bulletin={bulletin}
                date={date}
                ampm={"pm"}
              />
            ]
          ) : (
            <BulletinDaytimeReport bulletin={bulletin} date={date} />
          )}
          {bulletin.highlights && (
            <p className="bulletin-report-public-alert">
              <span className="icon-attention bulletin-report-public-alert-icon"></span>
              {bulletin.highlights}
            </p>
          )}
          <h2 className="subheader">
            {getLocalizedText(bulletin.avalancheActivity?.highlights)}
          </h2>
          <p>{getLocalizedText(bulletin.avalancheActivity?.comment)}</p>
        </div>
      </section>
      {(bulletin.tendency?.comment || bulletin.snowpackStructure?.comment) && (
        <section
          id={bulletin.bulletinID + "-bulletin-additional"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel brand">
            {(dangerPatterns.length > 0 ||
              bulletin.snowpackStructure?.comment) && (
              <div>
                <h2 className="subheader">
                  <FormattedMessage id="bulletin:report:snowpack-structure:headline" />
                </h2>
                {dangerPatterns.length > 0 && (
                  <ul className="list-inline list-labels">
                    <li>
                      <span className="tiny heavy letterspace">
                        <FormattedMessage id="bulletin:report:danger-patterns" />
                      </span>
                    </li>
                    {dangerPatterns.map((dp, index) => (
                      <li key={index}>
                        <DangerPatternItem dangerPattern={dp} />
                      </li>
                    ))}
                  </ul>
                )}
                <p>{getLocalizedText(bulletin.snowpackStructure?.comment)}</p>
              </div>
            )}
            {bulletin.tendency?.highlights &&
              getLocalizedText(bulletin.tendency?.highlights) && (
                <div>
                  <h2 className="subheader">
                    <FormattedMessage id="bulletin:report:tendency:headline" />
                  </h2>
                  <p>{getLocalizedText(bulletin.tendency?.highlights)}</p>
                </div>
              )}
            {/*
            <p className="bulletin-author">
              <FormattedMessage id="bulletin:report:author" />
              :&nbsp;
              {bulletin.author &&
                bulletin.author.name && (
                  <span>{bulletin.author.name}</span>
                )}
            </p>
              */}
          </div>
        </section>
      )}
      <section
        id={bulletin.bulletinID + "-back-to-map"}
        className="section-centered section-bulletin section-bulletin-additional"
      >
        <div className="panel brand">
          <a
            href="#page-main"
            className="icon-link icon-arrow-up"
            data-scroll=""
          >
            <FormattedMessage id="bulletin:linkbar:back-to-map" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default observer(BulletinReport);
