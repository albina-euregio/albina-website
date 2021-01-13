import React from "react";
import StationTableHeader from "./stationTableHeader";
import { modal_open_by_params } from "../../js/modal";
import { injectIntl, FormattedNumber } from "react-intl";
import { dateToDateTimeString } from "../../util/date.js";
import { regionCodes } from "../../util/regions";

class StationTable extends React.Component {
  constructor(props) {
    super(props);

    const defaultRender = (value, _row, digits = 0) =>
      typeof value === "number" ? (
        <FormattedNumber
          value={value}
          minimumFractionDigits={digits}
          maximumFractionDigits={digits}
        ></FormattedNumber>
      ) : (
        "–"
      );

    this.columns = [
      {
        data: "name",
        width: "150px",
        render: (_value, row) => (
          <span>
            <strong>{row.name}</strong>{" "}
            <span className="operator operator-st">({row.operator})</span>{" "}
            <span className="region region-st">
              {row.region &&
                regionCodes.includes(row.region) &&
                this.props.intl.formatMessage({ id: `region:${row.region}` })}
            </span>{" "}
            <span className="datetime">{dateToDateTimeString(row.date)}</span>
          </span>
        ),
        sortable: false,
        className: "mb-station m-name"
      },
      {
        data: "elev",
        render: defaultRender,
        unit: "m",
        width: "10px",
        className: "mb-snow m-altitude-1"
      },
      {
        group: "snow",
        data: "snow",
        render: defaultRender,
        unit: "cm",
        className: "mb-snow m-snowheight"
      },
      {
        group: "snow",
        data: "snow24",
        render: defaultRender,
        unit: "cm",
        className: "mb-snow m-24"
      },
      {
        group: "snow",
        data: "snow48",
        render: defaultRender,
        unit: "cm",
        className: "mb-snow m-48"
      },
      {
        group: "snow",
        data: "snow72",
        render: defaultRender,
        unit: "cm",
        className: "mb-snow m-72"
      },
      {
        group: "temp",
        data: "temp",
        digits: 1,
        render: defaultRender,
        unit: "°C",
        className: "mb-temp m-ltnow"
      },
      {
        group: "temp",
        data: "temp_max",
        digits: 1,
        render: defaultRender,
        unit: "°C",
        className: "mb-temp m-ltmax"
      },
      {
        group: "temp",
        data: "temp_min",
        digits: 1,
        render: defaultRender,
        unit: "°C",
        className: "mb-temp m-ltmin"
      },
      {
        group: "wind",
        data: "wdir",
        render: (_value, row) => (
          <span>
            {defaultRender(row.wdir, row, 0)}{" "}
            {row.x_wdir ? `(${row.x_wdir})` : ""}
          </span>
        ),
        unit: "°",
        className: "mb-wind m-winddir"
      },
      {
        group: "wind",
        data: "wspd",
        render: defaultRender,
        unit: "km/h",
        className: "mb-wind m-windspeed"
      },
      {
        group: "wind",
        data: "wgus",
        render: defaultRender,
        unit: "km/h",
        className: "mb-wind m-windmax"
      }
    ];

    this.columnGroups = {
      snow: {
        active: true
      },
      temp: {
        active: true
      },
      wind: {
        active: true
      }
    };

    this.regionFilter = null;
    this.searchText = "";
    this.sortValue = "";
    this.sortDir = "";
  }

  isDisplayColumn(column) {
    return !column.group || this.columnGroups[column.group].active;
  }

  shouldComponentUpdate(nextProps) {
    const shouldRegionFilterUpdate =
      (nextProps.activeRegion == "all" && this.regionFilter != null) ||
      nextProps.activeRegion != this.regionFilter;

    const shouldSearchFilterUpdate = nextProps.searchText != this.searchText;

    const shouldSortingUpdate =
      nextProps.sortDir != this.sortDir ||
      nextProps.sortValue != this.sortValue;

    return (
      this.props.data.length != nextProps.data.length ||
      this._shouldColumnGroupsUpdate() ||
      shouldRegionFilterUpdate ||
      shouldSearchFilterUpdate ||
      shouldSortingUpdate
    );
  }

  _shouldColumnGroupsUpdate() {
    return Object.keys(this.props.activeData)
      .map(id => this.props.activeData[id] != this.columnGroups[id].active)
      .reduce((acc, el) => acc || el, false);
  }

  _applyFiltersAndSorting(originalData) {
    const filters = [];

    // sorting
    if (this.props.sortValue) {
      filters.push(data =>
        data.sort((val1, val2) => {
          const order = this.props.sortDir == "asc" ? [-1, 1] : [1, -1];
          const a = val1[this.props.sortValue];
          const b = val2[this.props.sortValue];

          if (a === b) {
            return 0;
          }
          if (typeof b === "undefined" || b === false || b === null) {
            return order[1];
          }
          if (typeof a === "undefined" || a === false || a === null) {
            return order[0];
          }
          return a < b ? order[0] : order[1];
        })
      );

      this.sortDir = this.props.sortDir;
      this.sortValue = this.props.sortValue;
    }

    // hide filters
    if (this._shouldColumnGroupsUpdate()) {
      Object.keys(this.columnGroups).forEach(e => {
        this.columnGroups[e].active = this.props.activeData[e];
      });
    }

    // region filter
    if (regionCodes.indexOf(this.props.activeRegion) >= 0) {
      filters.push(data =>
        data.filter(row => row.region == this.props.activeRegion)
      );
      this.regionFilter = this.props.activeRegion;
    } else {
      this.regionFilter = null;
    }

    // searchText
    if (this.props.searchText) {
      filters.push(data =>
        data.filter(row =>
          row.name.match(new RegExp(this.props.searchText, "i"))
        )
      );
      this.searchText = this.props.searchText;
    }

    if (filters.length > 0) {
      // compose filters into a single function [f(x), g(x)] => f(g(x))
      const composedFilter = filters.reduce((f, g) => data => f(g(data)));
      return composedFilter(originalData);
    }
    return originalData;
  }

  _rowClicked(row) {
    window["modalStateStore"].setData({ stationData: row });
    modal_open_by_params(
      null,
      "inline",
      "#weatherStationDiagrams",
      "weatherStationDiagrams",
      true
    );
  }

  render() {
    return (
      <table
        ref="main"
        className="pure-table pure-table-striped pure-table-small table-measurements"
      >
        <StationTableHeader
          columns={this.columns}
          isDisplayColumn={this.isDisplayColumn.bind(this)}
          handleSort={this.props.handleSort}
          sortValue={this.props.sortValue}
          sortDir={this.props.sortDir}
        />
        <tbody>
          {this._applyFiltersAndSorting(this.props.data).map(row => (
            <tr key={row.id} onClick={() => this._rowClicked(row)}>
              {this.columns.map(
                (col, i) =>
                  this.isDisplayColumn(col) && (
                    <td key={row.id + "-" + i} className={col.className}>
                      {col.render(row[col.data], row, col.digits)}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default injectIntl(StationTable);
