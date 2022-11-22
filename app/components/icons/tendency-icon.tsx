import React from "react";

export default class TendencyIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  get className() {
    switch (this.props.tendency) {
      case "increasing":
        return "icon-arrow-increase";
      case "steady":
        return "icon-arrow-steady";
      case "decreasing":
        return "icon-arrow-decrease";
      default:
        return "";
    }
  }

  render() {
    return <span className={this.className} />;
  }
}
