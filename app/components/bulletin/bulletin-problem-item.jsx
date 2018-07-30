import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import ExpositionIcon from '../icons/exposition-icon.jsx';
import ElevationIcon from '../icons/elevation-icon.jsx';

class BulletinProblemItem extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get where() {
    if(this.props.problem.elevationLow && this.props.problem.elevationHigh) {
      return 'middle';
    }
    if(this.props.problem.elevationLow) {
      return 'above';
    }
    if(this.props.problem.elevationHigh) {
      return 'below';
    }
    return 'all';
  }

  get elevation() {
    const elevation = [];
    switch(this.where) {
    case 'below':
      elevation.push(this.props.problem.elevationHigh);
      break;

    case 'above':
      elevation.push(this.props.problem.elevationLow);
      break;

    case 'middle':
      elevation.push(this.props.problem.elevationLow);
      elevation.push(this.props.problem.elevationHigh);
      break;
    }
    return elevation;
  }

  get elevationText() {
    if(this.where == 'above') {
      return this.props.intl.formatMessage({id: 'bulletin:report:problem-above:hover'}, {elev: this.elevation[0]});
    }
    if(this.where == 'below') {
      return this.props.intl.formatMessage({id: 'bulletin:report:problem-below:hover'}, {elev: this.elevation[0]});
    }
    if(this.where == 'middle') {
      return this.props.intl.formatMessage({id: 'bulletin:report:problem-at:hover'}, {
        'elev-low': this.elevation[0],
        'elev-high': this.elevation[1]
      });
    }
    if(this.where == 'all') {
      return this.props.intl.formatMessage({id: 'bulletin:report:problem-all-elevations:hover'});
    }
    return '';
  }

  render() {
    const expositionText = this.props.intl.formatMessage({id: 'bulletin:report:exposition'});
    return (
      <li>
        { (this.props.problem && this.props.problem.avalancheSituation) &&
          <ProblemIconLink problem={this.props.problem.avalancheSituation} />
        }
        { (this.props.problem && this.props.problem.aspects) &&
          <ExpositionIcon expositions={this.props.problem.aspects} title={expositionText}/>
        }
        { (this.props.problem && this.where) &&
          <ElevationIcon elevation={this.elevation} where={this.where} title={this.elevationText} />
        }
      </li>
    );
  }
}

export default inject('locale')(injectIntl(observer(BulletinProblemItem)));
