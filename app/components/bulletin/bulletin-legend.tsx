import { FormattedMessage, useIntl } from "../../i18n";
import BulletinProblemFilter from "./bulletin-problem-filter.jsx";
import { warnlevelNumbers } from "../../util/warn-levels";
import { AvalancheProblemType } from "../../stores/bulletin/CAAMLv6.js";
import React from "react";
import { EnabledLanguages } from "./bulletin-glossary.js";
import {
  internalGlossaryEnum,
  getContentIdentifier
} from "./InternalGlossary/internal-glossary-lookupId.js";
const BulletinInternalGlossaryText = React.lazy(
  () => import("./internal-glossary-text")
);

interface Props {
  handleSelectRegion: (id?: string) => void;
  problems: Record<
    AvalancheProblemType,
    {
      highlighted: boolean;
    }
  >;
  toggleProblem: (problemId: AvalancheProblemType) => void;
}

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
                  strong: msg => <strong key={"strong"}>{msg}</strong>,
                  a: msg => (
                    <a key={"a"} href="/education/avalanche-problems">
                      <strong>{msg}</strong>
                    </a>
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
              <a href="/education/danger-scale">
                <FormattedMessage
                  id="bulletin:legend:danger-levels"
                  html={true}
                  values={{
                    strong: (...msg) => <strong>{msg}</strong>
                  }}
                />
              </a>
            </p>
            <ul className="list-inline list-legend">
              {Object.entries(warnlevelNumbers).map(
                ([id, num]) =>
                  num > 0 && (
                    <li key={id} className={`warning-level-${num}`}>
                      <span>
                        <strong>{num}</strong>{" "}
                        <a href={`/education/danger-scale/#level${num}`}>
                          <BulletinInternalGlossaryText
                            text={intl.formatMessage({
                              id: `danger-level:${id}`
                            })}
                            locale={intl.locale.slice(0, 2) as EnabledLanguages}
                            textKey={getContentIdentifier(
                              internalGlossaryEnum.dangerLevel,
                              num.toString()
                            )}
                          />
                        </a>
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
