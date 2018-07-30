import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ProblemIcon from './problem-icon.jsx';

class ProblemIconLink extends React.Component {
  BulletinProblemFilterItemexts;

  constructor(props) {
    super(props);
    // TODO unify with components/organsims/bulletin-problem-filter-item.jsx

    // query data from http://localhost/projects/albina-cms/web/api/taxonomy_term/avalanche_problems?fields[taxonomy_term--avalanche_problems]=name,descriptor
    this.problemTexts = {
      'new_snow': this.props.intl.formatMessage({id: 'problem:new-snow'}),
      'wind_drifted_snow': this.props.intl.formatMessage({id: 'problem:wind-drifted-snow'}),
      'weak_persistent_layer': this.props.intl.formatMessage({id: 'problem:weak-persistent-layer'}),
      'wet_snow': this.props.intl.formatMessage({id: 'problem:wet-snow'}),
      'gliding_snow': this.props.intl.formatMessage({id: 'problem:gliding-snow'}),
      'favourable_situation': this.props.intl.formatMessage({id: 'problem:favourable-situation'})
    }
  }

  render() {
    const title = this.problemTexts[this.props.problem] ? this.problemTexts[this.props.problem] : '';

    return(
      <div className="bulletin-report-picto avalanche-situation">
        { title &&
        <Link to={'/education/avalanche-problems#' + this.props.problem } className="img tooltip" href="#" title={title}>
          <ProblemIcon problem={this.props.problem} alt={title} active={true} />
        </Link>
        }
      </div>
    );
  }
}

export default inject('locale')(injectIntl(ProblemIconLink));
