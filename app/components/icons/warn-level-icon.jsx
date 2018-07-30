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
    const getWarnlevelText = (warnLevelNumber) => {
      return this.props.intl.formatMessage({id: 'danger-level:' + warnLevelNumber});
    };

    const elevText = this.props.elevation ? (this.props.elevation + 'm') : (
      (this.props.treeline)
        ? this.props.intl.formatMessage({id: 'bulletin:treeline'})
        : ''
    );
    const below = (this.props.elevation || this.props.treeline) ? this.props.below : this.props.above;

    const img = this.imgRoot + 'levels_' + below + '_' + this.props.above + '.png';

    var title, alt;
    if(below == this.props.above) {
      const params = {
        number: this.props.above,
        text: getWarnlevelText(this.props.above)
      };
      title = this.props.intl.formatMessage({id: 'bulletin:map:info:danger-picto:hover'}, params);
      alt = this.props.intl.formatMessage({id: 'bulletin:map:info:danger-picto:alt'}, params);
    } else {
      const params = {
        'elev': elevText,
        'number-below': below,
        'number-above': this.props.above,
        'text-below': getWarnlevelText(below),
        'text-above': getWarnlevelText(this.props.above)
      };
      title = this.props.intl.formatMessage({id: 'bulletin:map:info:danger-picto2:hover'}, params);
      alt = this.props.intl.formatMessage({id: 'bulletin:map:info:danger-picto2:alt'}, params);
    }

    return (
      <div className="bulletin-report-picto tooltip" title={title}>
        <img src={img} alt={alt} />{
          (this.props.above != this.props.below) &&
            <span>{elevText}</span>
        }
      </div>
    );
  }
}
export default inject('locale')(injectIntl(WarnLevelIcon));
