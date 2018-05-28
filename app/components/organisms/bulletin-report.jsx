import React from 'react';
import ProblemIcon from '../icons/problem-icon.jsx';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';
import ElevationIcon from '../icons/elevation-icon.jsx';

export default class BulletinReport extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
        <div className="panel field callout warning-level-3">
          <header className="bulletin-report-header">
            <p>Warning Level for <strong>Saturday 09.12.2017 PM</strong></p>
            <h1><span>Erheblich, Stufe 3</span></h1>
          </header>
          <div className="bulletin-report-pictobar">
            <div className="bulletin-report-region">
              <a href="#page-main" className="img icon-arrow-up tooltip" title="This Bulletin is valid for the selected region.<br/>Click to return to Map" data-scroll>
                <img src="../../images/dev/bulletin-report-region.png" alt="Selected region" />
              </a>
            </div>
            <ul className="list-plain list-bulletin-report-pictos">
              <li>
                <div className="bulletin-report-picto tooltip" title="Above 1800m: Warning Level 3<br/>Below 1800m: Warning Level 2">
                  <WarnLevelIcon below={2} above={3} elevation={1800} treeline={false} />
                  <span>1800m</span>
                </div>
                <div className="bulletin-report-tendency tooltip" title="Expectation for the following day">
                  <span className="icon-arrow-increase" />
                  <span><strong className="heavy">Tendency: Much Worse</strong><br />
                    on Sunday 10.12.2017 PM</span>
                </div>
              </li><li>
                <div className="bulletin-report-picto problem-above tooltip" title="Avalanche problem occurring above 2200m">
                  <ElevationIcon elevation="above" />
                  <span>2200m</span>
                </div>
                <div className="bulletin-report-picto">
                  <a href="#" className="img tooltip" title="Drifting Snow. Click to learn more">
                    <ProblemIcon problem={"wind_drifted_snow"} active={true} />
                  </a>
                </div>
                <div className="bulletin-report-picto bulletin-report-expositions expo_n expo_w expo_nw tooltip" title="Exposition">
                  <img src="../../images/pro/expositions/exposition_bg.png" alt="Exposition" className="bulletin-report-exposition-rose" />
                  <img src="../../images/pro/expositions/exposition_n.png" alt="North" className="expo_n" />
                  <img src="../../images/pro/expositions/exposition_ne.png" alt="North East" className="expo_ne" />
                  <img src="../../images/pro/expositions/exposition_e.png" alt="East" className="expo_e" />
                  <img src="../../images/pro/expositions/exposition_se.png" alt="South East" className="expo_se" />
                  <img src="../../images/pro/expositions/exposition_s.png" alt="South" className="expo_s" />
                  <img src="../../images/pro/expositions/exposition_sw.png" alt="South West" className="expo_sw" />
                  <img src="../../images/pro/expositions/exposition_w.png" alt="West" className="expo_w" />
                  <img src="../../images/pro/expositions/exposition_nw.png" alt="North West" className="expo_nw" />
                </div>
              </li>
              <li>
                <div className="bulletin-report-picto problem-below tooltip" title="Avalanche problem occurring below 1900m">
                  <ElevationIcon elevation="below" />
                  <span>1900m</span>
                </div>
                <div className="bulletin-report-picto">
                  <a href="#" className="img tooltip" title="Old Snow. Click to learn more">
                    <ProblemIcon problem={"old_snow"} active={true} />
                  </a>
                </div>
                <div className="bulletin-report-picto bulletin-report-expositions expo_e expo_se expo_s expo_sw tooltip" title="Exposition">
                  <img src="../../images/pro/expositions/exposition_bg.png" alt="Exposition" className="bulletin-report-exposition-rose" />
                  <img src="../../images/pro/expositions/exposition_n.png" alt="North" className="expo_n" />
                  <img src="../../images/pro/expositions/exposition_ne.png" alt="North East" className="expo_ne" />
                  <img src="../../images/pro/expositions/exposition_e.png" alt="East" className="expo_e" />
                  <img src="../../images/pro/expositions/exposition_se.png" alt="South East" className="expo_se" />
                  <img src="../../images/pro/expositions/exposition_s.png" alt="South" className="expo_s" />
                  <img src="../../images/pro/expositions/exposition_sw.png" alt="South West" className="expo_sw" />
                  <img src="../../images/pro/expositions/exposition_w.png" alt="West" className="expo_w" />
                  <img src="../../images/pro/expositions/exposition_nw.png" alt="North West" className="expo_nw" />
                </div>
              </li>
            </ul>
          </div>
          <h2 className="subheader">Oberhalb der Waldgrenze weiterhin verbreitet erhebliche Lawinengefahr</h2>
          <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke. Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
        </div>
      </section>
    );
  }
}
