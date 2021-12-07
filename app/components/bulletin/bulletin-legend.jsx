import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import BulletinProblemFilter from "./bulletin-problem-filter.jsx";
import { getWarnlevelNumber } from "../../util/warn-levels.js";

class BulletinLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                {this.props.intl.formatMessage(
                  { id: "bulletin:legend:highlight-regions" },
                  {
                    strong: msg => <strong>{msg}</strong>,
                    a: msg => (
                      <Link
                        to="/education/avalanche-problems"
                        className="tooltip"
                        title={this.props.intl.formatMessage({
                          id: "bulletin:legend:highlight-regions:hover"
                        })}
                      >
                        <strong>{msg}</strong>
                      </Link>
                    )
                  }
                )}
              </p>
              <BulletinProblemFilter
                handleSelectRegion={this.props.handleSelectRegion}
                problems={this.props.problems}
              />
            </div>
            <div className="normal-6 grid-item">
              <p>
                <Link
                  to="/education/danger-scale"
                  className="tooltip"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:legend:danger-levels:hover"
                  })}
                >
                  <FormattedHTMLMessage id="bulletin:legend:danger-levels" />
                </Link>
              </p>
              <ul className="list-inline list-legend">
                {warnlevels.map(l => (
                  <li key={l.id} className={"warning-level-" + l.num}>
                    <span>
                      <strong>{l.num}</strong>{" "}
                      {this.props.intl.formatMessage({
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
}
export default injectIntl(BulletinLegend);
