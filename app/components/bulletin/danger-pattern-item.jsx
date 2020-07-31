import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";

/**
 * @typedef {object} Props
 * @prop {Caaml.DangerPattern} dangerPattern
 *
 * @extends {React.Component<Props>}
 */
class DangerPatternItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Link
        to={"/education/danger-patterns#" + this.props.dangerPattern.type}
        className="label"
      >
        {this.props.intl.formatMessage({
          id: "danger-patterns:" + this.props.dangerPattern.type
        })}
      </Link>
    );
  }
}
export default inject("locale")(injectIntl(DangerPatternItem));
