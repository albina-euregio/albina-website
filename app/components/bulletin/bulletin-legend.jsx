import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import BulletinProblemFilter from "./bulletin-problem-filter.jsx";
import { preprocessContent } from "../../util/htmlParser";
import { getWarnlevelNumber } from "../../util/warn-levels.js";

class BulletinLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // replace the <a> element in bulletin:legend:highlight-regions with a
    // Link component
    const msg = this.props.intl.formatHTMLMessage({
      id: "bulletin:legend:highlight-regions"
    });

    // split the string at <a> and </a>
    const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/);

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
                {parts.length > 1 && preprocessContent(parts[1])}
                {parts.length > 2 && (
                  <Link
                    to="/education/avalanche-problems"
                    className="tooltip"
                    title={this.props.intl.formatMessage({
                      id: "bulletin:legend:highlight-regions:hover"
                    })}
                  >
                    <strong>{parts[2]}</strong>
                  </Link>
                )}
                {parts.length > 3 && preprocessContent(parts[3])}
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
