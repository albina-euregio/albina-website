import React from 'react';

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
                  <img src="../../images/pro/warning-pictos/levels_2_3.png" alt="Warning Levels 2 and 3" />
                  <span>1800m</span>
                </div>
                <div className="bulletin-report-tendency tooltip" title="Expectation for the following day">
                  <span className="icon-arrow-increase" />
                  <span><strong className="heavy">Tendency: Much Worse</strong><br />
                    on Sunday 10.12.2017 PM</span>
                </div>
              </li><li>
                <div className="bulletin-report-picto problem-above tooltip" title="Avalanche problem occurring above 2200m">
                  <img src="../../images/pro/warning-pictos/levels_above.png" alt="Avalanche problem above" />
                  <span>2200m</span>
                </div>
                <div className="bulletin-report-picto">
                  <a href="#" className="img tooltip" title="Drifting Snow. Click to learn more">
                    <img src="../../images/pro/avalanche-situations/drifting_snow.png" alt="Drifting Snow" />
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
                  <img src="../../images/pro/warning-pictos/levels_below.png" alt="Avalanche problem below" />
                  <span>1900m</span>
                </div>
                <div className="bulletin-report-picto">
                  <a href="#" className="img tooltip" title="Old Snow. Click to learn more">
                    <img src="../../images/pro/avalanche-situations/old_snow.png" alt="Old Snow" />
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
