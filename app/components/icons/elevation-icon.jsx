import React from 'react';

export default class ElevationIcon extends React.Component {
  imgRoot;
  icons;
  texts;

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
    this.texts = {
      'above': 'Avalanche problem occurring above',
      'below': 'Avalanche problem occurring below',
      'all': 'Avalanche problem occurring',
      'middle': 'Avalanche problem occurring'
    }
  }

  render() {
    const classes = [
      'bulletin-report-picto',
      'problem-altitude',
      'tooltip',
      ('problem-' + this.props.where)
    ];
    const elevText = this.props.elevation ? (this.props.elevation + 'm') : '';

    const src = this.imgRoot + this.icons[this.props.where];
    const title = this.texts[this.props.where] + elevText;

    return (
      <div className={classes.join(' ')} title={title}>
        <img src={src} alt={title} />{
          (this.props.where != 'all') &&
              <span>{elevText}<i className="icon"></i></span>
        }
      </div>
    );
  }
}
