import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import queryString from 'query-string';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline';

class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    }
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('weather/measurements').then((response) => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        content: responseParsed.data.attributes.body
      });
    });
  }

  render() {
    const params = {
      lang: window['appStore'].language
    };
    const url = Base.makeUrl(config.get('links.stationTable'),
      Object.assign(params, queryString.parse(this.props.location.params)));
    return (
      <div>
        <PageHeadline title={this.state.title} />
        <section className="section">
          <div className="table-container">
            <iframe id="stationTable" src={url}>
              <p>Your browser does not support iframes.</p>
            </iframe>
          </div>
        </section>
        <div>
          { (new Parser()).parse(this.state.content) }
        </div>
      </div>
    );
  }
}
export default withRouter(StationMeasurements);
