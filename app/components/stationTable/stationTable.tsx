import React from "react";
import { modal_open_by_params } from "../../js/modal";
import { useIntl } from "react-intl";
import { regionCodes } from "../../util/regions";
import { useState } from "react";
import { useEffect } from "react";
import { DATE_TIME_FORMAT } from "../../util/date";
import { type StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";

type SortDir = "desc" | "asc";

type Props = {
  activeData: {
    snow: boolean;
    temp: boolean;
    wind: boolean;
  };
  handleSort: (id: keyof StationData, dir: SortDir) => void;
  sortValue: keyof StationData;
  sortDir: SortDir;
  sortedFilteredData: StationData[];
};

const StationTable = (props: Props) => {
  const intl = useIntl();

  const defaultRender = (value: number, _row: StationData, digits = 0) =>
    typeof value === "number"
      ? intl.formatNumber(value, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        })
      : "–";

  type Column = {
    data: keyof StationData;
    width?: string;
    render: (
      _value: number,
      row: StationData,
      digits?: number
    ) => string | JSX.Element;
    sortable?: boolean;
    className: string;
    unit?: string;
    group?: string;
    digits?: number;
  };

  const columns: Column[] = [
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

  const [columnGroups] = useState({
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

  function isDisplayColumn(column: Column) {
    return !column.group || columnGroups[column.group].active;
  }

  function _rowClicked(station: StationData) {
    window["modalStateStore"].setData({
      stationData: props.sortedFilteredData,
      rowId: station.id
    });
    modal_open_by_params(
      null,
      "inline",
      "#weatherStationDiagrams",
      "weatherStationDiagrams"
    );
  }

  const sortClasses = (id: keyof StationData, dir: SortDir) => {
    const cls: string[] = [];
    if (dir == "asc") {
      cls.push("sort-ascending");
      cls.push("icon-up-open");
    } else {
      cls.push("sort-descending");
      cls.push("icon-down-open");
    }
    if (props.sortValue == id && props.sortDir != dir) {
      cls.push("sort-disabled");
    }
    return cls.join(" ");
  };

  const handleSort = (e: React.MouseEvent, el: Column, dir: SortDir) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleSort(
      el.data,
      props.sortValue == el.data ? (dir == "asc" ? "desc" : "asc") : dir
    );
  };

  const sortTitle = (id: keyof StationData, dir: SortDir) =>
    intl.formatMessage({
      id:
        "measurements:table:" +
        (props.sortValue == id ? "sort-toggle" : "sort-" + dir)
    });

  const title = (id: string) =>
    intl.formatMessage({
      id: "measurements:table:header:" + id
    });

  return (
    <table className="pure-table pure-table-striped pure-table-small table-measurements">
      <thead>
        <tr>
          {columns.map((el, i) => {
            if (!isDisplayColumn(el)) return false;
            return (
              <th key={i}>
                {title(el.data)}
                {el.unit && <span className="measure">{el.unit}</span>}
                {el.sortable !== false && (
                  <span className="sort-buttons">
                    {(["asc", "desc"] as SortDir[]).map(dir => (
                      <Tooltip key={dir} label={sortTitle(el.data, dir)}>
                        <a
                          href="#"
                          className={sortClasses(el.data, dir)}
                          onClick={e => handleSort(e, el, dir)}
                        >
                          <span className="is-visually-hidden">
                            {title(el.data)}: {sortTitle(el.data, dir)}
                          </span>
                        </a>
                      </Tooltip>
                    ))}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {props.sortedFilteredData.map((row: StationData) => (
          <tr key={row.id} onClick={() => _rowClicked(row)}>
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
