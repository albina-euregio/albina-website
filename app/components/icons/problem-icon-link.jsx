import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import ProblemIcon from "./problem-icon.jsx";

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

    return (
      <div className="bulletin-report-picto avalanche-situation">
        {title && (
          <Link
            to={"/education/avalanche-problems#" + problemType}
            className="img tooltip"
            href="#"
            title={title}
          >
            <ProblemIcon problem={problemType} alt={title} active={true} />
          </Link>
        )}
      </div>
    );
  }
}

export default inject("locale")(injectIntl(ProblemIconLink));
