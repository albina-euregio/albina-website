import React from 'react';
import { observer } from 'mobx-react';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';

@observer
export default class BulletinMapDetails extends React.Component {
  constructor(props) {
    super(props);
    this.warnlevelNumbers = { // TODO: refactor into bulletin store
      'low': 1,
      'moderate': 2,
      'considerable': 3,
      'high': 4,
      'very_high': 5
    };
  }

  getWarnLevelNumber(id) {
    if(id && this.warnlevelNumbers[id]) {
      return this.warnlevelNumbers[id];
    }
    return 0;
  }

  render() {
    // TODO: create common component with bulletin-report
    const daytime = (this.props.bulletin.hasDaytimeDependency && this.props.store.settings.ampm == 'pm') ?
      'afternoon' : 'forenoon';
    const b = this.props.bulletin[daytime];

    const warnlevels = {
      'above': this.getWarnLevelNumber(b.dangerRatingAbove),
      'below': this.getWarnLevelNumber(b.dangerRatingBelow)
    };

    const elevation = (this.props.bulletin.hasElevationDependency && !this.props.bulletin.treeline) ? this.props.bulletin.elevation : null;
    const treeline = this.props.bulletin.hasElevationDependency && this.props.bulletin.treeline;

    const problems = [];
    if(b.avalancheSituation1 && b.avalancheSituation1.avalancheSituation) {
      problems.push(b.avalancheSituation1.avalancheSituation);
    }
    if(b.avalancheSituation2 && b.avalancheSituation2.avalancheSituation) {
      if(problems.length > 0 && b.avalancheSituation2.avalancheSituation != problems[0]) {
        problems.push(b.avalancheSituation2.avalancheSituation);
      }
    }

    return (
      <ul className="list-plain">
        <li>
          <WarnLevelIcon below={warnlevels.below} above={warnlevels.above} elevation={elevation} treeline={treeline} />
        </li> { (problems.length > 0) &&
          problems.map(id => <li key={id}><ProblemIconLink problem={id} /></li>)
        }
      </ul>
    )
  }
}
