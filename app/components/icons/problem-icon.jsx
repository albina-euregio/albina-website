import React from 'react';

export default class ProblemIcon extends React.Component {
  imgRoot;
  problems;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = window['config'].get('projectRoot') + 'images/pro/avalanche-situations/';
  }

  render() {
    const path = this.imgRoot + this.props.problem + '.png';
    const style = this.props.active ? {} : {filter: 'grayscale(100%)'};

    return (
      <img src={path} alt={this.props.alt} style={style} />
    )
  }
}
