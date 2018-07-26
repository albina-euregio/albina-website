import React from 'react';

export default class ProblemIcon extends React.Component {
  imgRoot;
  problems;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = window['config'].get('projectRoot') + 'images/pro/avalanche-situations/';

    // FIXME: should be imported by config.ini or CMS
    this.problems = {
      'new_snow': {color: 'New_snow.png', grey: 'new_snow_grey.png'},
      'wind_drifted_snow': {color: 'Drifting_Snow.png', grey: 'drifting_snow_grey.png'},
      'weak_persistent_layer': {color: 'Old_Snow.png', grey: 'old_snow_grey.png'},
      'wet_snow': {color: 'Wet_Snow.png', grey: 'wet_snow_grey.png'},
      'gliding_snow': {color: 'gliding_snow.png', grey: 'gliding_snow_grey.png'},
      'favourable_situation': {color: 'favourable_situation.png', grey: 'favourable_situation_grey.png'}
    };
  }

  render() {
    if(!this.problems[this.props.problem]) {
      return (<span>undefined</span>);
    }

    const variant = this.props.active ? 'color' : 'grey';
    const path = this.imgRoot + this.problems[this.props.problem][variant];

    return (
      <img src={path} alt={this.props.alt} />
    )
  }
}
