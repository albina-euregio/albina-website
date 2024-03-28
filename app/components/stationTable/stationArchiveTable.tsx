import React from "react";
import { useIntl } from "../../i18n";
import { RegionCodes, regionCodes } from "../../util/regions";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";

type SortDir = "desc" | "asc";

type Props = {
  activeData: {
    snow: boolean;
    temp: boolean;
    wind: boolean;
    radiation: boolean;
  };
  handleSort: (id: keyof StationData, dir: SortDir) => void;
  sortValue: keyof StationData;
  sortDir: SortDir;
  sortedFilteredData: StationData[];
  activeYear: number | "";
  activeRegion: string;
};

export default function StationArchiveTable(props: Props) {
  const intl = useIntl();

  type RenderFun = (
    _value: number,
    row: StationData,
    digits?: number
  ) => string | JSX.Element;

  type Column = {
    data: keyof StationData;
    parameter?: string;
    subtitle?: string;
    render?: RenderFun;
    sortable?: boolean;
    className?: string;
    unit?: string;
    group?: keyof Props["activeData"];
    digits?: number;
  };

  const columns: Column[] = [
    {
      // Station (Operator)
      data: "name",
      render: (_value, row) => (
        <span>
          <strong>{row.name}</strong>{" "}
          <span className="operator operator-st">({row.operator})</span>{" "}
        </span>
      ),
      sortable: true,
      className: "mb-station m-name"
    },
    {
      // Region name <br> (Province)
      data: "microRegion",
      render: (_value, row) => (
        <span className="region" title={row.microRegion}>
          {intl.formatMessage({ id: `region:${row.microRegion}` })}
          {row.region && regionCodes.includes(row.region as RegionCodes) && (
            <span className={`region region-${row.region}`}>
              ({intl.formatMessage({ id: `region:${row.region}` })})
            </span>
          )}
        </span>
      ),
      className: "mb-station m-name"
    },
    {
      // Observation start
      data: "observationStart",
      render: (_value, row) => <span>{row.observationStart}</span>,
      sortable: true,
      className: "mb-station m-name"
    },
    {
      // Snow height
      group: "snow",
      data: "snow",
      parameter: "HS",
      sortable: false
    },
    {
      // Temperature
      group: "temp",
      data: "temp",
      parameter: "LT",
      sortable: false
    },
    {
      // Surface temperature
      group: "temp",
      data: "temp_srf",
      parameter: "T0",
      sortable: false
    },
    {
      // Dew point temperature
      group: "temp",
      data: "dewp",
      parameter: "TP",
      sortable: false
    },
    {
      // Relative humidity
      group: "temp",
      data: "rhum",
      parameter: "LF",
      sortable: false
    },
    {
      // Wind speed
      group: "wind",
      data: "wspd",
      parameter: "WG",
      sortable: false
    },
    {
      // Wind direction
      group: "wind",
      data: "wdir",
      parameter: "WR",
      sortable: false
    },
    {
      // Wind gust
      group: "wind",
      data: "wgus",
      parameter: "WG.Boe",
      sortable: false
    },
    {
      // Global radiation above
      group: "radiation",
      data: "gr_a",
      parameter: "GS",
      sortable: false
    },
    {
      // Global radiation below
      group: "radiation",
      data: "gr_b",
      parameter: "GS.unten",
      sortable: false
    }
  ];
  const displayColumns = columns.filter(
    c => !c.group || props.activeData[c.group]
  );

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

  const handleSort = (e: React.MouseEvent, col: Column, dir: SortDir) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleSort(
      col.data,
      props.sortValue == col.data ? (dir == "asc" ? "desc" : "asc") : dir
    );
  };

  const sortTitle = (id: keyof StationData, dir: SortDir) =>
    intl.formatMessage({
      id:
        "measurements-archive:table:" +
        (props.sortValue == id ? "sort-toggle" : "sort-" + dir)
    });

  function title(id: keyof StationData) {
    return intl.formatMessage({
      id: "measurements-archive:table:header:" + id
    });
  }

  function season(year: number | "", delimiter: string) {
    if (year === "") {
      return "latest";
    } else if (typeof year === "number") {
      const nextYear = year + 1;
      return `${year}${delimiter}${nextYear}`;
    } else {
      return year;
    }
  }

  return (
    <table className="pure-table pure-table-striped pure-table-small table-measurements">
      <thead>
        <tr>
          {displayColumns.map(col => (
            <th key={col.data}>
              {title(col.data)}
              {col.subtitle && <br />}
              {col.subtitle ? col.subtitle : ""}
              {col.sortable !== false && (
                <span className="sort-buttons">
                  {(["asc", "desc"] as SortDir[]).map(dir => (
                    <Tooltip key={dir} label={sortTitle(col.data, dir)}>
                      <a
                        href="#"
                        className={sortClasses(col.data, dir)}
                        onClick={e => handleSort(e, col, dir)}
                      >
                        <span className="is-visually-hidden">
                          {title(col.data)}: {sortTitle(col.data, dir)}
                        </span>
                      </a>
                    </Tooltip>
                  ))}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {props.sortedFilteredData.map((row: StationData) => (
          <tr key={row.id}>
            {displayColumns.map(col => (
              <td key={row.id + "-" + col.data} className={col.className}>
                {col.render?.(row[col.data], row, col.unit)}
                {!col.render && typeof row[col.data] === "number" && (
                  <span title={title(col.data)}>
                    <Tooltip
                      label={intl.formatMessage(
                        { id: "measurements-archive:table:button:tooltip" },
                        {
                          parameter: title(col.data),
                          station: row.name,
                          season: season(props.activeYear, "/")
                        }
                      )}
                    >
                      <a
                        href={config.template(
                          window.config.apis.weather.stationsArchiveFile,
                          {
                            "LWD-Nummer":
                              row.properties["LWD-Nummer"] || row.id,
                            parameter: col.parameter,
                            file: season(props.activeYear, "_")
                          }
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pure-button secondary small"
                      >
                        {intl.formatMessage({
                          id: "measurements-archive:table:button:title"
                        })}
                      </a>
                    </Tooltip>
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
