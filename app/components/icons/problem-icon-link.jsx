import React from 'react';
import { Link } from 'react-router-dom';
import ProblemIcon from './problem-icon.jsx';

export default class ProblemIconLink extends React.Component {
  BulletinProblemFilterItemexts;

  constructor(props) {
    super(props);
    // TODO unify with components/organsims/bulletin-problem-filter-item.jsx

    // query data from http://localhost/projects/albina-cms/web/api/taxonomy_term/avalanche_problems?fields[taxonomy_term--avalanche_problems]=name,descriptor
    this.problemTexts = {
      'new_snow': {en: 'New Snow'},
      'wind_drifted_snow': {en: 'Drifting Snow'},
      'weak_persistent_layer': {en: 'Weak Persistent Layer'},
      'wet_snow': {en: 'Wet Snow'},
      'gliding_snow': {en: 'Gliding Snow'}
    }
  }

  render() {
    const title = this.problemTexts[this.props.problem] ? this.problemTexts[this.props.problem].en : this.props.problem;

    return(
      <div className="bulletin-report-picto avalanche-situation">
        <Link to={'/education/avalanche-problems#' + this.props.problem } className="img tooltip" href="#" title={title}>
          <ProblemIcon problem={this.props.problem} alt={title} active={true} />
        </Link>
      </div>
    );
  }
}
