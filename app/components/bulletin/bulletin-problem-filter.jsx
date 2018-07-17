import React from 'react';
import { observer } from 'mobx-react';
import BulletinProblemFilterItem from './bulletin-problem-filter-item.jsx';

@observer
class BulletinProblemFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  isComponentActive(problemId) {
    return this.props.problems[problemId] && this.props.problems[problemId].highlighted;
  }

  render() {
    const listItems = Object.entries(this.props.problems).map((e) =>
      <BulletinProblemFilterItem key={e[0]} problemId={e[0]} active={this.isComponentActive(e[0])} />
    );

    return (
      <div>
        <p><strong>Highlight regions</strong> with special <a href="#" className="tooltip" title="Learn more"><strong>Avalanche Situation</strong></a></p>
        <ul className="list-inline list-avalanche-problems-filter">
          {listItems}
        </ul>
      </div>
    );
  }
}

export default BulletinProblemFilter;
