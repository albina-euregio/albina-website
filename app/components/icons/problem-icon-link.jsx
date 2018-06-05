import React from 'react';
import ProblemIcon from './problem-icon.jsx';

export default class ProblemIconLink extends React.Component {
  BulletinProblemFilterItemexts;

  constructor(props) {
    super(props);
    // TODO unify with components/organsims/bulletin-problem-filter-item.jsx

    // query data from http://localhost/projects/albina-cms/web/api/taxonomy_term/avalanche_problems?fields[taxonomy_term--avalanche_problems]=name,descriptor
    this.problemTexts = {
      "new_snow": {en: "New Snow"},
      "wind_drifted_snow": {en: "Drifting Snow"},
      "old_snow": {en: "Old Snow"},
      "wet_snow": {en: "Wet Snow"},
      "gliding_snow": {en: "Gliding Snow"}
    }
  }

  render() {
    const title = this.problemTexts[this.props.problem].en;

    return(
      <div className="bulletin-report-picto avalanche-situation">
        <a className="img tooltip" href="#" title={title}>
          <ProblemIcon problem={this.props.problem} alt={title} active={true} />
        </a>
      </div>
    );
  }
};
