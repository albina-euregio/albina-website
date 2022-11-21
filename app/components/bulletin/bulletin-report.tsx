import React from "react";
import { observer } from "mobx-react";
import { FormattedMessage, useIntl } from "react-intl";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport from "./bulletin-daytime-report";
import { LONG_DATE_FORMAT, parseDate } from "../../util/date";
import { preprocessContent } from "../../util/htmlParser";
import { getWarnlevelNumber } from "../../util/warn-levels";
import { findGlossaryStrings } from "./bulletin-glossary";
import { Tooltip } from "../tooltips/tooltip";
import type { DaytimeBulletin } from "../../stores/bulletin";

type Props = { date: string; daytimeBulletin: DaytimeBulletin };

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 */
function BulletinReport({ date, daytimeBulletin }: Props) {
  const intl = useIntl();
  const bulletin = daytimeBulletin?.forenoon;
  const dangerPatterns = bulletin.dangerPatterns || [];

  function getLocalizedText(elem: string | undefined) {
    // bulletins are loaded in correct language
    if (!elem) return "";
    elem = elem.replace(/&lt;br\/&gt;/g, "<br/>");
    if (import.meta.env.DEV || import.meta.env.BASE_URL === "/beta/") {
      const withGlossary = findGlossaryStrings(elem);
      try {
        return preprocessContent(withGlossary);
      } catch (e) {
        console.warn(e, { elem, withGlossary });
      }
    }
    return preprocessContent(elem);
  }

  if (!daytimeBulletin || !bulletin) {
    return <div />;
  }

  const maxWarnlevel = {
    id: daytimeBulletin.maxWarnlevel,
    number: getWarnlevelNumber(daytimeBulletin.maxWarnlevel)
  };
  const classes = "panel field callout warning-level-" + maxWarnlevel.number;

  return (
    <div>
      <section
        id={daytimeBulletin.id + "-main"}
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
                    date: intl.formatDate(parseDate(date), LONG_DATE_FORMAT),
                    daytime: ""
                  }}
                />
              </span>
            </p>
            <h1 className="bulletin-report-header-danger-level">
              <span>
                <FormattedMessage
                  id={
                    maxWarnlevel.number == 0
                      ? "bulletin:report:headline2:level0"
                      : "bulletin:report:headline2"
                  }
                  values={{
                    number: maxWarnlevel.number,
                    text: intl.formatMessage({
                      id: "danger-level:" + maxWarnlevel.id
                    })
                  }}
                />
              </span>
            </h1>
          </header>
          {daytimeBulletin.hasDaytimeDependency ? (
            [
              <BulletinDaytimeReport
                key={"am"}
                bulletin={daytimeBulletin.forenoon}
                date={date}
                publicationTime={daytimeBulletin.forenoon.publicationTime}
                ampm={"am"}
              />,
              <BulletinDaytimeReport
                key={"pm"}
                bulletin={daytimeBulletin.afternoon}
                date={date}
                publicationTime={daytimeBulletin.afternoon.publicationTime}
                ampm={"pm"}
              />
            ]
          ) : (
            <BulletinDaytimeReport
              bulletin={daytimeBulletin.forenoon}
              date={date}
              publicationTime={daytimeBulletin.forenoon.publicationTime}
            />
          )}
          {bulletin.highlights && (
            <p className="bulletin-report-public-alert">
              <span className="icon-attention bulletin-report-public-alert-icon"></span>
              {bulletin.highlights}
            </p>
          )}
          <h2 className="subheader">
            {getLocalizedText(bulletin.avalancheActivityHighlights)}
          </h2>
          <p>{getLocalizedText(bulletin.avalancheActivityComment)}</p>
        </div>
      </section>
      {(bulletin.tendencyComment || bulletin.snowpackStructureComment) && (
        <section
          id={daytimeBulletin.id + "-bulletin-additional"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel brand">
            {(dangerPatterns.length > 0 ||
              bulletin.snowpackStructureComment) && (
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
                <p>{getLocalizedText(bulletin.snowpackStructureComment)}</p>
              </div>
            )}
            {bulletin.tendencyComment &&
              getLocalizedText(bulletin.tendencyComment) && (
                <div>
                  <h2 className="subheader">
                    <FormattedMessage id="bulletin:report:tendency:headline" />
                  </h2>
                  <p>{getLocalizedText(bulletin.tendencyComment)}</p>
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
        id={daytimeBulletin.id + "-back-to-map"}
        className="section-centered section-bulletin section-bulletin-additional"
      >
        <div className="panel brand">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:linkbar:back-to-map:hover"
            })}
          >
            <a
              href="#page-main"
              className="icon-link icon-arrow-up"
              data-scroll=""
            >
              <FormattedMessage id="bulletin:linkbar:back-to-map" />
            </a>
          </Tooltip>
        </div>
      </section>
    </div>
  );
}

export default observer(BulletinReport);
