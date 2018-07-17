import React from 'react';
import { observer } from 'mobx-react';
import ProblemIcon from '../icons/problem-icon.jsx';

@observer
class BulletinProblemFilterItem extends React.Component {
  problemTexts;

  constructor(props) {
    super(props);
    this.problemTexts = {
      'new_snow': {en: 'New Snow'},
      'wind_drifted_snow': {en: 'Drifting Snow'},
      'weak_persistent_layer': {en: 'Weak Persistent Layer'},
      'wet_snow': {en: 'Wet Snow'},
      'gliding_snow': {en: 'Gliding Snow'}
    }
    this.state = {
      active: this.props.active,
      id: this.props.problemId
    }
  }

  toggle(event) {
    event.preventDefault();

    if(this.state.active) {
      window['bulletinStore'].dimProblem(this.state.id);
    } else {
      window['bulletinStore'].highlightProblem(this.state.id);
    }
    this.state.active = !this.state.active;
  }

  render() {
    const problemText = this.problemTexts[this.props.problemId].en;
    const title = (this.props.active ? 'Dim' : 'Highlight') + ' regions with ' + problemText;
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
