import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";

/**
 * @typedef {object} Props
 * @prop {Bulletin.DangerPattern} dangerPattern
 *
 * @extends {React.Component<Props>}
 */
class DangerPatternItem extends React.Component {
  patternTexts;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Link
        to={"/education/danger-patterns#" + this.props.dangerPattern}
        className="label"
      >
        {this.props.intl.formatMessage({
          id: "danger-patterns:" + this.props.dangerPattern
        })}
      </Link>
    );
  }
}
export default inject("locale")(injectIntl(DangerPatternItem));
