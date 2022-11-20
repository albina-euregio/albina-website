import React from "react";
import StationTableHeader from "./stationTableHeader";
import { modal_open_by_params } from "../../js/modal";
import { useIntl } from "react-intl";
import { regionCodes } from "../../util/regions";
import { useState } from "react";
import { useEffect } from "react";
import { DATE_TIME_FORMAT } from "../../util/date";

const StationTable = props => {
  const intl = useIntl();

  const defaultRender = (value, _row, digits = 0) =>
    typeof value === "number"
      ? intl.formatNumber(value, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        })
      : "–";

  const columns = [
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
              intl.formatMessage({ id: `region:${row.region}` })}
          </span>{" "}
          <span className="datetime">
            {intl.formatDate(row.date, DATE_TIME_FORMAT)}
          </span>
        </span>
      ),
      sortable: true,
      className: "mb-station m-name"
    },
    {
      data: "microRegion",
      render: (_value, row) => (
        <span className="region">
          {intl.formatMessage({ id: `region:${row.microRegion}` })} (
          {row.microRegion})
        </span>
      ),
      unit: " ",
      width: "10px",
      className: "mb-snow m-name"
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

  let [columnGroups] = useState({
    snow: {
      active: true
    },
    temp: {
      active: true
    },
    wind: {
      active: true
    }
  });

  useEffect(
    () =>
      Object.keys(columnGroups).forEach(e => {
        columnGroups[e].active = props.activeData[e];
      }),
    [columnGroups, props.activeData]
  );

  function isDisplayColumn(column) {
    return !column.group || columnGroups[column.group].active;
  }

  function _applyFiltersAndSorting(originalData) {
    const filters = [];

    // sorting
    if (props.sortValue) {
      filters.push(data =>
        data.sort((val1, val2) => {
          const order = props.sortDir == "asc" ? [-1, 1] : [1, -1];
          const a = val1[props.sortValue];
          const b = val2[props.sortValue];

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
    }

    // region filter
    if (regionCodes.includes(props.activeRegion)) {
      filters.push(data =>
        data.filter(row => row.region == props.activeRegion)
      );
    }

    // searchText
    if (props.searchText) {
      filters.push(data =>
        data.filter(
          row =>
            row.name.match(new RegExp(props.searchText, "i")) ||
            row.microRegion.match(new RegExp(props.searchText, "i")) ||
            row.operator.match(new RegExp(props.searchText, "i"))
        )
      );
    }

    if (filters.length > 0) {
      // compose filters into a single function [f(x), g(x)] => f(g(x))
      const composedFilter = filters.reduce((f, g) => data => f(g(data)));
      return composedFilter(originalData);
    }
    return originalData;
  }

  function _rowClicked(stationData, rowId) {
    window["modalStateStore"].setData({
      stationData: stationData,
      rowId: rowId
    });
    modal_open_by_params(
      null,
      "inline",
      "#weatherStationDiagrams",
      "weatherStationDiagrams",
      true
    );
  }

  return (
    <table className="pure-table pure-table-striped pure-table-small table-measurements">
      <StationTableHeader
        columns={columns}
        isDisplayColumn={c => isDisplayColumn(c)}
        handleSort={props.handleSort}
        sortValue={props.sortValue}
        sortDir={props.sortDir}
      />
      <tbody>
        {_applyFiltersAndSorting(props.data).map(row => (
          <tr
            key={row.id}
            onClick={() =>
              _rowClicked(_applyFiltersAndSorting(props.data), row.id)
            }
          >
            {columns.map(
              (col, i) =>
                isDisplayColumn(col) && (
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
};

export default StationTable;
