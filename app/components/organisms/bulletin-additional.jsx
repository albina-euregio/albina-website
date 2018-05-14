import React from 'react';

export default class BulletinAdditional extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-additional" className="section-centered section-bulletin section-bulletin-additional">
        <div className="panel brand">
          <h2 className="subheader">Snowpack Structure</h2>
          <ul className="list-inline list-labels">
            <li><span className="tiny heavy letterspace">Gefahrenmuster</span></li>
            <li><a href="#" className="label">Lockerer Schnee und Wind</a></li>
            <li><a href="#" className="label">Gleitschnee</a></li>
          </ul>
          <p>Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
          <h2 className="subheader">Weather</h2>
          <ul className="list-inline ">
            <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li>
          </ul>
          <h2 className="subheader">Tendency</h2>
          <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke.</p>
          <p className="bulletin-author">Author: <a href="#" title className>Rudi Mair</a></p>
        </div>
      </section>
    );
  }
}
