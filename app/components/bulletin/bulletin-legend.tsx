import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "../../i18n";
import BulletinProblemFilter from "./bulletin-problem-filter.jsx";
import { warnlevelNumbers } from "../../util/warn-levels";
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
              {Object.entries(warnlevelNumbers).map(
                ([id, num]) =>
                  num > 0 && (
                    <li key={id} className={`warning-level-${num}`}>
                      <span>
                        <strong>{num}</strong>{" "}
                        {intl.formatMessage({
                          id: `danger-level:${id}`
                        })}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
export default BulletinLegend;
