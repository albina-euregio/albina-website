import React from 'react';

export default class ProblemIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = '../../images/pro/warning-pictos/';
  }

  render() {
    const img = this.imgRoot + 'levels_' + this.props.below + '_' + this.props.above + '.png';
    const alt = "Warning " + (
      (this.props.below == this.props.above) ? ('level ' + this.props.below) : ('levels ' + this.props.below + ' and ' + this.props.above)
    );

    return (
      <img src={img} alt={alt} />
    );
  }
}
