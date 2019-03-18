import React from 'react';
import { withRouter } from 'react-router-dom';
import { Parser } from 'html-to-react';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import Base from '../base';
import StationDataStore from '../stores/stationDataStore';
import PageHeadline from '../components/organisms/page-headline';
import FilterBar from "../components/organisms/filter-bar";
import ProvinceFilter from "../components/filters/province-filter";
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
    this.store = window['stationDataStore'];
  }

  componentDidMount() {
    this.store.load();
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

  handleChangeSearch() {

  }

  handleChangeRegion() {

  }

  render() {
    const classChanged = "selectric-changed";
    return (
      <div>
        <PageHeadline title={this.state.title} marginal={this.state.headerText} />
        <FilterBar
          search={true}
          searchTitle={this.props.intl.formatMessage({
            id: "measurements:search"
          })}
          searchOnChange={this.handleChangeSearch}
          searchValue={this.store.searchText} >

          <ProvinceFilter
            title={this.props.intl.formatMessage({
              id: "measurements:filter:province"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeRegion}
            value={this.store.regionActive}
            className={this.store.regionActive !== "all" ? classChanged : ""}
          />
        </FilterBar>
        <section className="section">
          <div className="table-container">
            <StationTable data={this.store.data} />
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
export default inject("locale")(injectIntl(withRouter(observer(StationMeasurements))));
