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
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from '../components/organisms/sm-share';
import StationTable from '../components/stationTable/stationTable';
import StationTableHeader from '../components/stationTable/stationTableHeader';

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

  handleChangeSearch = (val) => {

  };

  handleToggleActive = (val) => {
    this.store.activeData[val] = !this.store.activeData[val];
  };

  handleChangeRegion = (val) => {
    this.store.activeRegion = val;
  };

  handleSort = (id, dir) => {

  };

  render() {
    const classChanged = "selectric-changed";
    const hideFilters = [
      "snow",
      "temp",
      "wind"
    ];
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
            value={this.store.activeRegion}
            className={(this.store.activeRegion !== "all") ? classChanged : ""} />

          <HideGroupFilter
            title={this.props.intl.formatMessage({
              id: "measurements:filter:hide"
            })} >
            {
              hideFilters.map((e) => (
                <HideFilter
                  key={e}
                  id={e}
                  title={this.props.intl.formatMessage({
                    id: "measurements:filter:hide:" + e
                  })}
                  tooltip={this.props.intl.formatMessage({
                    id: "measurements:filter:hide:"
                      + (this.store.activeData[e] ? "active" : "inactive")
                      + ":hover"
                  })}
                  active={this.store.activeData[e]}
                  onToggle={this.handleToggleActive} />
              ))
            }
          </HideGroupFilter>
        </FilterBar>
        <section className="section">
          <div className="table-container">
            <StationTable
              data={this.store.data}
              activeData={this.store.activeData}
              activeRegions={this.store.activeRegion}
              sortValue={this.store.sortVale}
              sortDir={this.store.sortDir}
              header=
                <StationTableHeader
                  handleSort={this.handleSort}
                  sortValue={null}
                  sortDir={null} />
              />
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
