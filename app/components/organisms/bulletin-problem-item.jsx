import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

@observer class BulletinProblemItem extends React.Component {
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
      elevation.push(this.props.elevationHigh);
      break;

    case 'above':
      elevation.push(this.props.elevationLow);
      break;

    case 'middle':
      elevation.push(this.props.elevationHigh);
      elevation.push(this.props.elevationLow);
      break;
    }


    return (
      <div>
        <ProblemIconLink problem={this.props.problem.avalancheSituation} />
        <ExpositionIcon expositions={this.props.problem.aspects} />
        <ElevationIcon elevation={elevation} where={this.where} />
      </div>
    );
  }
}

export default BulletinProblemItem;
