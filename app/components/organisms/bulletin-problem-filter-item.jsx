import React from 'react';
import { observer } from 'mobx-react';
import ProblemIcon from './problem-icon.jsx';

@observer
class BulletinProblemFilterItem extends React.Component {
  problemTexts;

  constructor(props) {
    super(props);
    this.problemTexts = {
      "new_snow": {en: "New Snow"},
      "wind_drifted_snow": {en: "Drifting Snow"},
      "old_snow": {en: "Old Snow"},
      "wet_snow": {en: "Wet Snow"},
      "gliding_snow": {en: "Gliding Snow"}
    }
    this.state = {
      active: this.props.active,
      id: this.props.problemId
    }
  }

  toggle(event) {
    event.preventDefault();

    if(this.state.active) {
      bulletinStore.excludeProblem(this.state.id);
    } else {
      bulletinStore.includeProblem(this.state.id);
    }
    this.state.active = !this.state.active;
  }

  render() {
    const problemText = this.problemTexts[this.props.problemId].en;
    const title = (this.props.active ? 'Hide' : 'Show') + ' regions with ' + problemText;
    const classes = 'img tooltip' + (this.props.active ? '' : ' js-deactivated');

    return (
      <li>
        <a href="#" title={title} className={classes} onClick={(e) => this.toggle(e)} >
          <ProblemIcon problem={this.props.problemId} active={true} alt={problemText} />
          <ProblemIcon problem={this.props.problemId} active={false} alt={problemText} />
        </a>
      </li>
    );
  }
}

export default BulletinProblemFilterItem;
