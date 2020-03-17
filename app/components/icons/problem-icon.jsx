import React from "react";

export default class ProblemIcon extends React.Component {
  imgRoot;
  problems;

  constructor(props) {
    super(props);

    this.imgRoot =
      window.config.projectRoot + "images/pro/avalanche-situations/";
    this.imgFormat = window.config.webp ? ".webp" : ".png";
  }

  render() {
    const path = this.imgRoot + this.props.problem + this.imgFormat;
    const style = this.props.active ? {} : { filter: "grayscale(100%)" };

    return <img src={path} alt={this.props.alt} style={style} />;
  }
}