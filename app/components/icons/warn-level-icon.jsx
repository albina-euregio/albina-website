import React from 'react';
import {inject} from 'mobx-react';
import {injectIntl, FormattedMessage} from 'react-intl';

class WarnLevelIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);

    // http://localhost/projects/albina-cms/web/de/api/taxonomy_term/warning_levels?sort=level&fields[taxonomy_term--warning_levels]=name,level
    // FIXME: should go to config.ini
    this.imgRoot = window['config'].get('projectRoot') + 'images/pro/warning-pictos/';
  }

  render() {
    const elevText = this.props.elevation ? (this.props.elevation + 'm') : (
      (this.props.treeline)
        ? (<span className="treeline"><FormattedMessage id="treeline" /></span>)
        : ''
    );
    const below = (this.props.elevation || this.props.treeline) ? this.props.below : this.props.above;

    const img = this.imgRoot + 'levels_' + below + '_' + this.props.above + '.png';
    const title = 'Warning ' + (
      (below == this.props.above) ? ('level ' + this.props.above) : ('levels ' + this.props.below + ' and ' + this.props.above)
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
export default inject('locale')(injectIntl(WarnLevelIcon));
