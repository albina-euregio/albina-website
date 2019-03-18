import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import { observer } from 'mobx-react';
import StationDataStore from '../stores/stationDataStore';
import Base from '../base';
import PageHeadline from '../components/organisms/page-headline';
import SmShare from '../components/organisms/sm-share';
import StationTable from '../components/stationTable/stationTable';

class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      headerText: '',
      content: '',
      sharable: false
    }

    if(!window['stationDataStore']) {
      window['stationDataStore'] = new StationDataStore();
    }
  }

  componentDidMount() {
    window['stationDataStore'].load();
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
    const url = Base.makeUrl(config.get('links.stationTable'), params);
    return (
      <div>
        <PageHeadline title={this.state.title} marginal={this.state.headerText} />
        <section className="section">
          <div className="table-container">
            <StationTable data={window['stationDataStore'].data} />
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
export default withRouter(observer(StationMeasurements));
