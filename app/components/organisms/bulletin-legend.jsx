import React from 'react';
import BulletinProblemFilter from './bulletin-problem-filter.jsx';

export default class BulletinLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-legend" className="section-padding section-bulletin-legend">
        <div className="section-centered">
          <div className="grid">
            <div className="normal-6 grid-item">
              <BulletinProblemFilter problems={this.props.problems} />
            </div>
            <div className="normal-6 grid-item">
              <p><strong>Legend</strong> <a href="#" className="tooltip" title="Learn more"><strong>Warning Levels</strong></a></p>
              <ul className="list-inline list-legend">
                <li className="warning-level-1"><span><strong>1</strong> gering</span></li>
                <li className="warning-level-2"><span><strong>2</strong> mäßig</span></li>
                <li className="warning-level-3"><span><strong>3</strong> erheblich</span></li>
                <li className="warning-level-4"><span><strong>4</strong> groß</span></li>
                <li className="warning-level-5"><span><strong>5</strong> sehr groß</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
