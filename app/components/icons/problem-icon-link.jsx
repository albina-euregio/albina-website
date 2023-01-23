import React from "react";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import ProblemIcon from "./problem-icon.jsx";
import { Tooltip } from "../tooltips/tooltip";

/**
 * @typedef {object} Props
 * @prop {Caaml.AvalancheProblem} problem
 *
 * @extends {React.Component<Props>}
 */
class ProblemIconLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const problem = this.props.problem;
    const problemType = problem.type;
    const title = this.props.intl.formatMessage({
      id: "problem:" + problemType
    });
    const caption = this.props.intl.formatMessage({
      id: "problem:" + problemType + ":short"
    });

    return (
      <div className="bulletin-report-picto avalanche-situation">
        {title && (
          <Tooltip label={title}>
            <Link
              to={"/education/avalanche-problems#" + problemType}
              className="img"
              href="#"
            >
              <div className="picto-img">
                <ProblemIcon problem={problemType} alt={title} active={true} />
              </div>
              <div className="picto-caption">{ caption }</div>
            </Link>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default injectIntl(ProblemIconLink);
