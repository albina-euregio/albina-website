import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
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
    this.store.load("");
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
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "measurements:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "measurements:headline" })}
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
        <section className="section-centered section-context">
          <div className="panel">
            <h2 className="subheader">
              {this.props.intl.formatMessage({ id: "button:snow:headline" })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:hn:link"
                  })}
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:snow:hn:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:hn:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:hs:link"
                  })}
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:snow:hs:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:hs:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:ff:link"
                  })}
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:snow:ff:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:ff:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:stations:link"
                  })}
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:snow:stations:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:snow:stations:text"
                  })}
                </a>
              </li>
            </ul>
          </div>
        </section>
        <SmShare />
      </>
    );
  }
}
export default injectIntl(withRouter(observer(StationMeasurements)));
