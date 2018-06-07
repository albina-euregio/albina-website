import React from 'react';

export default class ExpositionIcon extends React.Component {
  imgRoot;
  alts;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = window['config'].get('projectRoot') + 'images/pro/expositions/';
    this.alts = {
      'n': 'North',
      'ne': 'North East',
      'e': 'East',
      'se': 'South East',
      's': 'South',
      'sw': 'South West',
      'w': 'West',
      'nw': 'North West'
    }
  }

  render() {
    const classes = ['bulletin-report-picto', 'bulletin-report-expositions', 'tooltip'].concat(
      this.props.expositions.map((e) =>
        'expo_' + e.toLowerCase()
      )
    );
    const backgroundEntries = Object.entries(this.alts).map((e) =>
      <img key={e[0]} className={'expo_' + e[0]} src={this.imgRoot + 'exposition_' + e[0] + '.png'} alt={this.alts[e[0]]}/>
    );
    return (
      <div className={classes.join(' ')} title="Exposition">
        <img className="bulletin-report-exposition-rose" src={this.imgRoot + 'exposition_bg.png'} alt="Exposition" />
        {backgroundEntries}
      </div>
    );
  }
}
