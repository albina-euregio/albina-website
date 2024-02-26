import React, {
  type FunctionComponent,
  Suspense,
  useState,
  useMemo
} from "react";
import DiffMatchPatch from "diff-match-patch";
import { FormattedMessage, useIntl } from "../../i18n";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport, {
  compareDangerRatings,
  compareRegions
} from "./bulletin-daytime-report";
import { compareAvalancheProblem } from "./bulletin-problem-item";
import SynthesizedBulletin from "./synthesized-bulletin";
import { LONG_DATE_FORMAT } from "../../util/date";
import { getWarnlevelNumber } from "../../util/warn-levels";
const BulletinGlossaryText = React.lazy(
  () => import("./bulletin-glossary-text")
);
import {
  Bulletin,
  hasDaytimeDependency,
  getDangerPatterns
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import BulletinStatusLine from "./bulletin-status-line";
import { wordDiff } from "../../util/wordDiff";

const LocalizedText: FunctionComponent<{
  text: string;
  text170000: string;
  showDiff: 0 | 1 | 2;
}> = ({ text, text170000, showDiff }) => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  // bulletins are loaded in correct language
  if (!text) return <></>;
  text = text.replace(/&lt;br\/&gt;/g, "<br/>");
  if (text !== text170000 && text170000 && showDiff > 0) {
    text = wordDiff(text170000, text)
      .map(([diff, value]) =>
        diff === DiffMatchPatch.DIFF_INSERT
          ? `<ins>${value.replace(
              /(<br\/>)+/g,
              br => `</ins>${br}<ins>`
            )}</ins>`
          : diff === DiffMatchPatch.DIFF_DELETE
            ? showDiff === 2
              ? `<del>${value.replace(
                  /(<br\/>)+/g,
                  br => `</del>${br}<del>`
                )}</del>`
              : ""
            : value
      )
      .join("");
  }
  return (
    <Suspense fallback={<div dangerouslySetInnerHTML={{ __html: text }} />}>
      <BulletinGlossaryText text={text} locale={lang} />
    </Suspense>
  );
};

type Props = {
  date: Date;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
};

const ENABLE_DIFFING =
  import.meta.env.DEV || import.meta.env.BASE_URL === "/beta/";

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 */
function BulletinReport({ date, bulletin, bulletin170000 }: Props) {
  const intl = useIntl();
  const [showDiff, setShowDiff] = useState<0 | 1 | 2>(0);
  const dangerPatterns = getDangerPatterns(bulletin.customData);
  const dangerPatterns170000 = getDangerPatterns(bulletin170000?.customData);

  const isInserted = useMemo(() => {
    if (!ENABLE_DIFFING || !bulletin || !bulletin170000) {
      return false;
    }
    const checks: ((b: Bulletin) => string | number)[] = [
      b => b.avalancheActivity?.highlights,
      b => b.avalancheActivity?.comment,
      b => b.snowpackStructure?.comment,
      b => b.tendency?.[0]?.highlights,
      b => b.tendency?.[0]?.tendencyType,
      b => getDangerPatterns(b.customData).join()
    ];
    return !(
      checks.every(c => c(bulletin) === c(bulletin170000)) &&
      compareRegions(bulletin.regions, bulletin170000?.regions) &&
      compareDangerRatings(
        bulletin.dangerRatings,
        bulletin170000?.dangerRatings
      ) &&
      bulletin.avalancheProblems.every(problem =>
        compareAvalancheProblem(
          problem,
          bulletin170000?.avalancheProblems.find(
            p => p.problemType === problem.problemType
          )
        )
      )
    );
  }, [bulletin, bulletin170000]);

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

  const hasTendencyHighlights =
    Array.isArray(bulletin.tendency) &&
    bulletin.tendency.some(tendency => tendency.highlights);

  return (
    <div>
      <section
        id={bulletin.bulletinID + "-main"}
        className="section-centered section-bulletin section-bulletin-report"
      >
        <div className={classes}>
          <header className="bulletin-report-header">
            {isInserted && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <p className="bulletin-report-header-diff">
                <span
                  onClick={() => setShowDiff(d => (d + 1) % 3)}
                  style={{ color: "#ff0000", cursor: "pointer" }}
                >
                  <BulletinStatusLine status="ok" bulletin={bulletin} />
                  {showDiff == 2 && " ⇔"}
                  {showDiff == 1 && " ⇒"}
                </span>
              </p>
            )}
            <p className="bulletin-report-header-meta">
              <span>
                <FormattedMessage
                  id="bulletin:report:headline"
                  html={true}
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
                key={"earlier"}
                bulletin={bulletin}
                bulletin170000={bulletin170000}
                showDiff={showDiff}
                date={date}
                validTimePeriod={"earlier"}
              />,
              <BulletinDaytimeReport
                key={"later"}
                bulletin={bulletin}
                bulletin170000={bulletin170000}
                showDiff={showDiff}
                date={date}
                validTimePeriod={"later"}
              />
            ]
          ) : (
            <BulletinDaytimeReport
              bulletin={bulletin}
              bulletin170000={bulletin170000}
              showDiff={showDiff}
              date={date}
            />
          )}
          {bulletin.highlights && (
            <p className="bulletin-report-public-alert">
              <span className="icon-attention bulletin-report-public-alert-icon"></span>
              {bulletin.highlights}
            </p>
          )}
          <h2 className="subheader">
            <LocalizedText
              text={bulletin.avalancheActivity?.highlights}
              text170000={bulletin170000?.avalancheActivity?.highlights}
              showDiff={showDiff}
            />
          </h2>
          <p>
            <LocalizedText
              text={bulletin.avalancheActivity?.comment}
              text170000={bulletin170000?.avalancheActivity?.comment}
              showDiff={showDiff}
            />
          </p>
        </div>
      </section>
      {(hasTendencyHighlights || bulletin.snowpackStructure?.comment) && (
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
                        <DangerPatternItem
                          dangerPattern={dp}
                          isInserted={
                            showDiff && !dangerPatterns170000.includes(dp)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
                <p>
                  <LocalizedText
                    text={bulletin.snowpackStructure?.comment}
                    text170000={bulletin170000?.snowpackStructure?.comment}
                    showDiff={showDiff}
                  />
                </p>
              </div>
            )}
            {hasTendencyHighlights && (
              <div>
                <h2 className="subheader">
                  <FormattedMessage id="bulletin:report:tendency:headline" />
                </h2>
                {bulletin.tendency.map((tendency, index) => (
                  <p key={index}>
                    <LocalizedText
                      text={tendency?.highlights}
                      text170000={bulletin170000?.tendency?.[index]?.highlights}
                      showDiff={showDiff}
                    />
                  </p>
                ))}
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
            onClick={e => scrollIntoView(e)}
            className="icon-link icon-arrow-up"
          >
            <FormattedMessage id="bulletin:linkbar:back-to-map" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default BulletinReport;
