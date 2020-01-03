import React from "react";
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import StationDataStore from "../stores/stationDataStore";
import PageHeadline from "../components/organisms/page-headline";
import FilterBar from "../components/organisms/filter-bar";
import ProvinceFilter from "../components/filters/province-filter";
import HideGroupFilter from "../components/filters/hide-group-filter";
import HideFilter from "../components/filters/hide-filter";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import loadable from "@loadable/component";
import { preprocessContent } from "../util/htmlParser";
const StationTable = loadable(() =>
  import(
    /* webpackChunkName: "app-stationTable" */ "../components/stationTable/stationTable"
  )
);

class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };

    if (!window["stationDataStore"]) {
      window["stationDataStore"] = new StationDataStore();
    }
    this.store = window["stationDataStore"];
  }

  componentDidMount() {
    this.store.load();
    window["staticPageStore"]
      .loadPage("weather/measurements")
      .then(responseParsed => {
        this.setState({
          title: responseParsed.data.attributes.title,
          headerText: responseParsed.data.attributes.header_text,
          content: responseParsed.data.attributes.body,
          sharable: responseParsed.data.attributes.sharable
        });
      });
  }

  handleChangeSearch = val => {
    this.store.searchText = val;
  };

  handleToggleActive = val => {
    this.store.activeData[val] = !this.store.activeData[val];
  };

  handleChangeRegion = val => {
    this.store.activeRegion = val;
  };

  handleSort = (id, dir) => {
    this.store.sortValue = id;
    this.store.sortDir = dir;
  };

  render() {
    const classChanged = "selectric-changed";
    const hideFilters = ["snow", "temp", "wind"];
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <FilterBar
          search={true}
          searchTitle={this.props.intl.formatMessage({
            id: "measurements:search"
          })}
          searchOnChange={this.handleChangeSearch}
          searchValue={this.store.searchText}
        >
          <ProvinceFilter
            title={this.props.intl.formatMessage({
              id: "measurements:filter:province"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeRegion}
            value={this.store.activeRegion}
            className={this.store.activeRegion !== "all" ? classChanged : ""}
          />

          <HideGroupFilter
            title={this.props.intl.formatMessage({
              id: "measurements:filter:hide"
            })}
          >
            {hideFilters.map(e => (
              <HideFilter
                key={e}
                id={e}
                title={this.props.intl.formatMessage({
                  id: "measurements:filter:hide:" + e
                })}
                tooltip={this.props.intl.formatMessage({
                  id:
                    "measurements:filter:hide:" +
                    (this.store.activeData[e] ? "active" : "inactive") +
                    ":hover"
                })}
                active={this.store.activeData[e]}
                onToggle={this.handleToggleActive}
              />
            ))}
          </HideGroupFilter>
        </FilterBar>
        <section className="section">
          <div className="table-container">
            <StationTable
              data={this.store.data}
              activeData={this.store.activeData}
              activeRegion={this.store.activeRegion}
              sortValue={this.store.sortValue}
              sortDir={this.store.sortDir}
              searchText={this.store.searchText}
              handleSort={this.handleSort}
            />
          </div>
        </section>
        <div>{preprocessContent(this.state.content)}</div>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding"></div>
        )}
      </>
    );
  }
}
export default inject("locale")(
  injectIntl(withRouter(observer(StationMeasurements)))
);
