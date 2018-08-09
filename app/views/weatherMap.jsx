import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import queryString from 'query-string';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline.jsx';

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
    // use the last path parameter as "domain" and add optional parameters from
    // query string
    const params = {
      domain: this.props.match.params.datum,
      lang: window['appStore'].language
    };
    const url = Base.makeUrl(config.get('links.meteoViewer'),
      Object.assign(params, queryString.parse(this.props.location.search)));

    return (
      <div>
        <PageHeadline title={this.state.title} />
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
export default withRouter(WeatherMap);
