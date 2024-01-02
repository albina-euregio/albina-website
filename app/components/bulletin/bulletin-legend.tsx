import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "../../i18n";
import BulletinProblemFilter from "./bulletin-problem-filter.jsx";
import { getWarnlevelNumber } from "../../util/warn-levels";
import { AvalancheProblemType } from "../../stores/bulletin/CAAMLv6.js";

type Props = {
  handleSelectRegion: (id?: string) => void;
  problems: Record<
    AvalancheProblemType,
    {
      highlighted: boolean;
    }
  >;
  toggleProblem: (problemId: AvalancheProblemType) => void;
};

function BulletinLegend(props: Props) {
  const intl = useIntl();
  const warnlevelKeys = [
    "low",
    "moderate",
    "considerable",
    "high",
    "very_high"
  ];
  const warnlevels = warnlevelKeys.map(k => {
    return { id: k, num: getWarnlevelNumber(k) };
  });

  return (
    <section
      id="section-bulletin-legend"
      className="section-padding section-bulletin-legend"
    >
      <div className="section-centered">
        <div className="grid">
          <div className="normal-6 grid-item">
            <p>
              <FormattedMessage
                id="bulletin:legend:highlight-regions"
                html={true}
                values={{
                  strong: msg => <strong>{msg}</strong>,
                  a: msg => (
                    <Link to="/education/avalanche-problems">
                      <strong>{msg}</strong>
                    </Link>
                  )
                }}
              />
            </p>
            <BulletinProblemFilter
              handleSelectRegion={props.handleSelectRegion}
              problems={props.problems}
              toggleProblem={props.toggleProblem}
            />
          </div>
          <div className="normal-6 grid-item">
            <p>
              <Link to="/education/danger-scale">
                <FormattedMessage
                  id="bulletin:legend:danger-levels"
                  html={true}
                  values={{
                    strong: (...msg) => <strong>{msg}</strong>
                  }}
                />
              </Link>
            </p>
            <ul className="list-inline list-legend">
              {warnlevels.map(l => (
                <li key={l.id} className={"warning-level-" + l.num}>
                  <span>
                    <strong>{l.num}</strong>{" "}
                    {intl.formatMessage({
                      id: "danger-level:" + l.id
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
export default BulletinLegend;
