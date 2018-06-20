import React from 'react';

export default class Context extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="section-centered section-context">
        <div className="panel">
          <h2 className="subheader">Snow &amp; Weather</h2>
          <p><a href="#" title="The Button" className="secondary pure-button">The Button</a>
          </p>
          <h2 className="subheader">Dig deeper – Education &amp; Prevention</h2>
          <ul className="list-inline ">
            <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li>
          </ul>
          <h2 className="subheader">Is there more to know / to be linked to?</h2>
          <ul className="list-inline ">
            <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
            </li>
          </ul>
          <p>Spinach tigernut. Corn cucumber grape black-eyed pea asparagus spinach avocado dulse bunya nuts epazote celery desert raisin celtuce burdock plantain yarrow napa cabbage. Plantain okra seakale endive <a href="#">tigernut pea sprouts asparagus</a> corn chard peanut beet greens groundnut radicchio carrot coriander gumbo gram celtuce. Jícama nori bamboo shoot collard greens okra radicchio tomato.</p>
          <p className="small color-brand-very-dark">Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
        </div>
      </section>
    );
  }
}