import React from 'react';

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
              <p><strong>Hide regions</strong> with special <a href="#" className="tooltip" title="Learn more"><strong>Avalanche Situation</strong></a></p>
              <ul className="list-inline list-avalanche-problems-filter">
                <li>
                  <a href="#" title="Show regions with New Snow" className="img js-deactivated tooltip">
                    <img src="../../images/pro/avalanche-situations/new_snow.png" alt="New Snow" />
                    <img src="../../images/pro/avalanche-situations/new_snow_grey.png" alt="New Snow" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Hide regions with Drifting Snow" className="img tooltip">
                    <img src="../../images/pro/avalanche-situations/drifting_snow.png" alt="Drifting Snow" />
                    <img src="../../images/pro/avalanche-situations/drifting_snow_grey.png" alt="Drifting Snow" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Hide regions with Old Snow" className="img tooltip">
                    <img src="../../images/pro/avalanche-situations/old_snow.png" alt="Old Snow" />
                    <img src="../../images/pro/avalanche-situations/old_snow_grey.png" alt="Old Snow" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Hide regions with Wet Snow" className="img tooltip">
                    <img src="../../images/pro/avalanche-situations/wet_snow.png" alt="Wet Snow" />
                    <img src="../../images/pro/avalanche-situations/wet_snow_grey.png" alt="Wet Snow" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Hide regions with Gliding Snow" className="img tooltip">
                    <img src="../../images/pro/avalanche-situations/gliding_snow.png" alt="Gliding Snow" />
                    <img src="../../images/pro/avalanche-situations/gliding_snow_grey.png" alt="Gliding Snow" />
                  </a>
                </li>
              </ul>
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
