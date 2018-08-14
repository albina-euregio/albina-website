import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import queryString from 'query-string';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline';
import SmShare from '../components/organisms/sm-share';

class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      headerText: '',
      content: '',
      sharable: false
    }
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('weather/measurements').then((response) => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
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
        <PageHeadline title={this.state.title} marginal={this.state.headerText} />
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
        { this.state.sharable ?
          <SmShare /> : <div className="section-padding"></div>
        }
      </div>
    );
  }
}
export default withRouter(StationMeasurements);
