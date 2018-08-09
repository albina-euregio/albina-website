import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Parser } from 'html-to-react';
import queryString from 'query-string';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline.jsx';
import Menu from '../components/menu';

class WeatherMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    };
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('weather/map').then((response) => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        content: responseParsed.data.attributes.body
      });
    });

    window.addEventListener('message', (e) => {
      if(e.data) {
        try {
          const data = JSON.parse(e.data);
          if(data.changes && data.changes.domain) {
            this.props.history.replace('/weather/map/' + data.changes.domain);
          }
        } catch(e) {
          console.log('JSON parse error: ' + e.data);
        }
      }
    });
  }

  render() {
    const menuItems = window['menuStore'].getMenu('weather-map');

    // use the last path parameter as "domain" and add optional parameters from
    // query string
    const params = {
      domain: this.props.match.params.datum,
      lang: window['appStore'].language
    };
    const url = Base.makeUrl(config.get('links.meteoViewer'),
      Object.assign(params, queryString.parse(this.props.location.search)));

    const forwardLink = {param: '2018-08-10 12:00', text: "+12h"};
    const backwardLink = {param: '2018-08-09 12:00', text: "-12h"};

    return (
      <div>
        <PageHeadline title={this.state.title} />
        <section className="section-flipper">
          <div id="flipper">
            <div className="section-padding-width flipper-controls">
              <div className="section-centered">
                <Menu className="list-inline flipper-buttongroup"
                  entries={menuItems}
                  childClassName="list-plain subnavigation"
                  menuItemClassName="secondary pure-button"
                  activeClassName="js-active" />

                <div className="grid flipper-left-right">
                  <div className="all-6 grid-item">
                    { backwardLink &&
                      <Link
                        to={
                          '/weather/map/'
                          + this.props.match.params.datum
                          + '/' + encodeURIComponent(backwardLink.param)
                        }
                        className="icon-link tooltip flipper-left"
                        title={this.props.intl.formatMessage({id: 'weathermap:header:dateflipper:back'})} >
                        <span className="icon-arrow-left"></span>
                        &nbsp;{backwardLink.text}
                      </Link>
                    }
                  </div>
                  <div className="all-6 grid-item">
                    { forwardLink &&
                      <Link
                        to={
                          '/weather/map/'
                          + this.props.match.params.datum
                          + '/' + encodeURIComponent(forwardLink.param)
                        }
                        className="icon-link tooltip flipper-left"
                        title={this.props.intl.formatMessage({id: 'weathermap:header:dateflipper:forward'})} >
                        {forwardLink.text}&nbsp;
                        <span className="icon-arrow-right"></span>
                      </Link>
                    }
                  </div>

                </div>
              </div>
            </div>

            <div className="section-centered">
              <div className="section-padding-width flipper-header">
                <h2 className="subheader">Test1</h2>
                <h2>Test2</h2>
              </div>
            </div>

          </div>
        </section>
        <section className={'section-map' + (config.get('map.useWindowWidth') ? '' : ' section-centered')}>
          <iframe id="meteoMap" src={url}>
            <p>Your browser does not support iframes.</p>
          </iframe>
        </section>
        <div>
          { (new Parser()).parse(this.state.content) }
        </div>
      </div>
    );
  }
}
export default inject('locale')(injectIntl(withRouter(WeatherMap)));
