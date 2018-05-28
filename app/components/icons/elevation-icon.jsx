import React from 'react';

export default class ElevationIcon extends React.Component {
  imgRoot;
  icons;
  alts;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = '../../images/pro/warning-pictos/';
    this.icons = {
      "above": "levels_above.png",
      "below": "levels_below.png",
      "all": "levels_all.png",
      "middle": "levels_middle.png"
    }
    this.alts = {
      "above": "Avalanche problem above",
      "below": "Avalanche problem below",
      "all": "Avalanche problem",
      "middle": "Avalanche problem"
    }
  }

  render() {
    const src = this.imgRoot + this.icons[this.props.elevation];
    const alt = this.alts[this.props.elevation];

    return (
      <img src={src} alt={alt} />
    );
  }
}
