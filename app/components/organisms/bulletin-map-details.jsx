import React from 'react';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';

export default class BulletinMapDetails extends React.Component {
  constructor(props) {
    super(props);
    this.warnlevelNumbers = { // TODO: refactor into bulletin store
      'low': 1,
      'moderate': 2,
      'considerable': 3,
      'high': 4,
      'very high': 5
    };
  }

  render() {
    // TODO: create common component with bulletin-report
    const daytime = (this.props.bulletin.hasDaytimeDependency && this.props.store.settings.ampm == 'pm') ?
      'afternoon' : 'forenoon';
    const b = this.props.bulletin[daytime];

    const warnlevels = {
      'above': b.dangerRatingAbove ? this.warnlevelNumbers[b.dangerRatingAbove] : 0,
      'below': b.dangerRatingBelow ? this.warnlevelNumbers[b.dangerRatingBelow] : 0
    };

    const elevation = (this.props.bulletin.hasElevationDependency && !this.props.bulletin.treeline) ? this.props.bulletin.elevation : null;
    const treeline = this.props.bulletin.hasElevationDependency && this.props.bulletin.treeline;

    const problems = [];
    if(b.avalancheSituation1) {
      problems.push(b.avalancheSituation1.avalancheSituation);
    }
    if(b.avalancheSituation2) {
      if(problems.length > 0 && b.avalancheSituation2.avalancheSituation != problems[0]) {
        problems.push(b.avalancheSituation2.avalancheSituation);        
      }
    }

    return (
      <ul className="list-plain">
        <li>
          <WarnLevelIcon below={warnlevels.below} above={warnlevels.above} elevation={elevation} treeline={treeline} />
        </li> {
          problems.map(id => <li key={id}><ProblemIconLink problem={id} /></li>)
        }
      </ul>
    )
  }
}
