import React from 'react';

export default class ElevationIcon extends React.Component {
  imgRoot;
  icons;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot = window['config'].get('projectRoot') + 'images/pro/warning-pictos/';
    this.icons = {
      'above': 'levels_above.png',
      'below': 'levels_below.png',
      'all': 'levels_all.png',
      'middle': 'levels_middle.png'
    }
  }

  get elevationText() {
    if(this.props.where == 'middle') {
      return this.props.elevation.sort().join('-') + 'm';
    }
    if(this.props.where != 'all') {
      return this.props.elevation[0] + 'm';
    }
    return '';
  }

  render() {
    const classes = [
      'bulletin-report-picto',
      'problem-altitude',
      'tooltip',
      ('problem-' + this.props.where)
    ];
    const src = this.imgRoot + this.icons[this.props.where];

    return (
      <div className={classes.join(' ')} title={this.props.title}>
        <img src={src} alt={this.props.title} />{
          (this.props.where != 'all') &&
              <span>{this.elevationText}<i className="icon"></i></span>
        }
      </div>
    );
  }
}
