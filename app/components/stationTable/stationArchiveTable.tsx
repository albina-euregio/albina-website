import React from "react";
import { useIntl } from "react-intl";
import { RegionCodes, regionCodes } from "../../util/regions";
import { StationArchiveData } from "../../stores/stationArchiveDataStore";
import { Tooltip } from "../tooltips/tooltip";
import { currentSeasonDate, currentSeasonYear } from "../../util/date-season";

type SortDir = "desc" | "asc";

type Props = {
  activeData: {
    snow: boolean;
    temp: boolean;
    wind: boolean;
    radiation: boolean;
  };
  handleSort: (id: keyof StationArchiveData, dir: SortDir) => void;
  sortValue: keyof StationArchiveData;
  sortDir: SortDir;
  sortedFilteredData: StationArchiveData[];
  activeYear: number;
  activeRegion: string;
};

export default function StationArchiveTable(props: Props) {
  const intl = useIntl();

  const parameterMap = new Map<string, string>([
    ["temp", "LT"],
    ["temp_max", "LT_MAX"],
    ["temp_min", "LT_MIN"],
    ["temp_srf", "OFT"],
    ["dewp", "TD"],
    ["snow", "HS"],
    ["snow24", "HSD24"],
    ["snow48", "HSD48"],
    ["snow72", "HSD72"],
    ["precipitation6", "N6"],
    ["precipitation24", "N24"],
    ["precipitation48", "N48"],
    ["precipitation72", "N72"],
    ["rhum", "RH"],
    ["wdir", "WR"],
    ["wspd", "WG"],
    ["wgus", "WG_BOE"],
    ["gr_a", "GS_O"],
    ["gr_b", "GS_U"]
  ]);

  type RenderFun = (
    _value: number,
    row: StationArchiveData,
    unit: string,
    digits?: number
  ) => string | JSX.Element;

  type Column = {
    data: keyof StationArchiveData;
    subtitle?: string;
    render?: RenderFun;
    sortable?: boolean;
    className: string;
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
      unit: "cm",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Snow height difference 24h
      group: "snow",
      data: "snow24",
      unit: "cm",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Snow height difference 48h
      group: "snow",
      data: "snow48",
      unit: "cm",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Snow height difference 72h
      group: "snow",
      data: "snow72",
      unit: "cm",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Temperature
      group: "temp",
      data: "temp",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Temperature min
      group: "temp",
      data: "temp_min",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Temperature max
      group: "temp",
      data: "temp_max",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Surface temperature
      group: "temp",
      data: "temp_srf",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Dew point temperature
      group: "temp",
      data: "dewp",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Relative humidity
      group: "temp",
      data: "rhum",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Wind speed
      group: "wind",
      data: "wspd",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Wind direction
      group: "wind",
      data: "wdir",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Wind gust
      group: "wind",
      data: "wgus",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Global radiation above
      group: "radiation",
      data: "gr_a",
      sortable: false,
      className: "mb-snow m-snowheight"
    },
    {
      // Global radiation below
      group: "radiation",
      data: "gr_b",
      sortable: false,
      className: "mb-snow m-snowheight"
    }
  ];
  const displayColumns = columns.filter(
    c => !c.group || props.activeData[c.group]
  );

  const sortClasses = (id: keyof StationArchiveData, dir: SortDir) => {
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

  const sortTitle = (id: keyof StationArchiveData, dir: SortDir) =>
    intl.formatMessage({
      id:
        "measurements-archive:table:" +
        (props.sortValue == id ? "sort-toggle" : "sort-" + dir)
    });

  function title(id: keyof StationArchiveData) {
    return intl.formatMessage({
      id: "measurements-archive:table:header:" + id
    });
  }

  function season(year: number, deliminator: string) {
    if (year != undefined) {
      if (year == currentSeasonYear()) {
        return "latest";
      } else {
        const nextYear = year + 1;
        return `${year}${deliminator}${nextYear}`;
      }
    } else {
      return `2022${deliminator}2023`;
    }
  }

  function downloadURL(id, parameter) {
    return `https://wiski.tirol.gv.at/lawine/produkte/${id}/${parameterMap.get(
      parameter
    )}/${season(props.activeYear, "_")}.csv`;
  }

  function parameterExists(parameter, properties) {
    return properties[parameterMap.get(parameter)] != undefined;
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
        {props.sortedFilteredData.map((row: StationArchiveData) => (
          <tr key={row.id}>
            {displayColumns.map(col => (
              <td key={row.id + "-" + col.data} className={col.className}>
                {col.render && col.render(row[col.data], row, col.unit)}
                {!col.render && parameterExists(col.data, row.properties) && (
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
                        href={downloadURL(row.id, col.data)}
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
