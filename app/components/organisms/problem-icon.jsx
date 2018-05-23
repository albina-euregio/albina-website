import React from 'react';

export default class ProblemIcon extends React.Component {
  imgRoot;
  problems;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = '../../images/pro/avalanche-situations/';

    // FIXME: should be imported by config.ini or CMS
    this.problems = {
      "new_snow": {color: "new_snow.png", grey: "new_snow_grey.png"},
      "wind_drifted_snow": {color: "drifting_snow.png", grey: "drifting_snow_grey.png"},
      "old_snow": {color: "old_snow.png", grey: "old_snow_grey.png"},
      "wet_snow": {color: "wet_snow.png", grey: "wet_snow_grey.png"},
      "gliding_snow": {color: "gliding_snow", grey: "gliding_snow_grey.png"}
    };
  }

  render() {
    const variant = this.props.active ? 'color' : 'grey';
    const path = this.imgRoot + this.problems[this.props.problem][variant];

    return (
      <img src={path} alt={this.props.alt} />
    )
  }
}
