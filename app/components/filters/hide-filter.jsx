import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default class HideFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const classes = ["label"];
    if (this.props.active) {
      classes.push("js-active");
    }

    return (
      <Tooltip label={this.props.tooltip}>
        <a
          className={classes.join(" ")}
          href="#"
          onClick={e => {
            //e.target.blur();
            e.preventDefault();
            e.stopPropagation();
            this.props.onToggle(this.props.id);
          }}
        >
          {this.props.title}
        </a>
      </Tooltip>
    );
  }
}
