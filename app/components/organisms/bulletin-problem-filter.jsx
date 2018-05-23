import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import BulletinProblemFilterItem from './bulletin-problem-filter-item.jsx';

@observer
class BulletinProblemFilter extends React.Component {
  problems;

  constructor(props) {
    super(props);

    // FIXME: should be imported by config.ini or CMS
    this.problems = [
      "new_snow",
      "wind_drifted_snow",
      "old_snow",
      "wet_snow",
      "gliding_snow"/* ,
      "favourable_situation" */
    ];
  }

  render() {
    const listItems = this.problems.map((pId) =>
      <BulletinProblemFilterItem key={pId} problemId={pId} active={true} />
    );

    return (
      <div>
        <p><strong>Hide regions</strong> with special <a href="#" className="tooltip" title="Learn more"><strong>Avalanche Situation</strong></a></p>
        <ul className="list-inline list-avalanche-problems-filter">
          {listItems}
        </ul>
      </div>
    );
  }
}

export default BulletinProblemFilter;
