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
      return this.props.elevation.join('-') + 'm';
    }
    if(this.props.where == 'all') {
      return 'any altitude';
    }
    return
  }

  get altText() {
    let txt = '';
    if(this.props.where == 'above') {
      txt = 'Avalanche problem occuring above';
    } else if(this.props.where == 'below') {
      txt = 'Avalanche problem occuring below';
    } else {
      txt = 'Avalanche problem occurring at';
    }
    return txt + ' ' + this.elevationText;
  }

  render() {
    const classes = [
      'bulletin-report-picto',
      'problem-altitude',
      'tooltip',
      ('problem-' + this.props.where)
    ];
    const src = this.imgRoot + this.icons[this.props.where];
    const title = this.altText;

    return (
      <div className={classes.join(' ')} title={title}>
        <img src={src} alt={title} />{
          (this.props.where != 'all') &&
              <span>{this.elevationText}<i className="icon"></i></span>
        }
      </div>
    );
  }
}
