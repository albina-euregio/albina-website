import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import ExpositionIcon from '../icons/exposition-icon.jsx';
import ElevationIcon from '../icons/elevation-icon.jsx';

@observer
export default class BulletinProblemItem extends React.Component {
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

  render() {
    const elevation = [];
    switch(this.where) {
    case 'below':
      elevation.push(this.props.problem.elevationHigh);
      break;

    case 'above':
      elevation.push(this.props.problem.elevationLow);
      break;

    case 'middle':
      elevation.push(this.props.problem.elevationHigh);
      elevation.push(this.props.problem.elevationLow);
      break;
    }

    return (
      <li>
        { (this.props.problem && this.props.problem.avalancheSituation) &&
          <ProblemIconLink problem={this.props.problem.avalancheSituation} />
        }
        { (this.props.problem && this.props.problem.aspects) &&
          <ExpositionIcon expositions={this.props.problem.aspects} />
        }
        { (this.props.problem && this.where) &&
          <ElevationIcon elevation={elevation} where={this.where} />
        }
      </li>
    );
  }
}

//export default BulletinProblemItem;
