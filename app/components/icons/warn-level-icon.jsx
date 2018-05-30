import React from 'react';

export default class WarnLevelIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);

    // http://localhost/projects/albina-cms/web/de/api/taxonomy_term/warning_levels?sort=level&fields[taxonomy_term--warning_levels]=name,level
    // FIXME: should go to config.ini
    this.imgRoot = '../../images/pro/warning-pictos/';
  }

  render() {
    const elevText = this.props.elevation ? (this.props.elevation + 'm') : (
      (this.props.treeline) ? (<span class="treeline"></span>) : ''
    );
    const img = this.imgRoot + 'levels_' + this.props.below + '_' + this.props.above + '.png';
    const title = "Warning " + (
      (this.props.below == this.props.above) ? ('level ' + this.props.below) : ('levels ' + this.props.below + ' and ' + this.props.above)
    );

    return (
      <div className="bulletin-report-picto tooltip" title={title}>
        <img src={img} alt={title} />{
          (this.props.above != this.props.below) &&
            <span>{elevText}</span>
        }
      </div>
    );
  }
}
