import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { RegionCodes, regionCodes } from "../../util/regions";
import { DATE_TIME_FORMAT } from "../../util/date";
import { type StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import WeatherStationDiagrams from "../dialogs/weather-station-diagrams";

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

export default function StationTable(props: Props) {
  const intl = useIntl();
  const ref = useRef<HTMLDialogElement>(null);

  type RenderFun = (
    _value: number,
    row: StationData,
    unit: string,
    digits?: number
  ) => string | JSX.Element;

  type Column = {
    data: keyof StationData;
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
      // Station (Betreiber) <br> Zeitstempel
      data: "name",
      render: (_value, row) => (
        <span>
          <strong>{row.name}</strong>{" "}
          <span className="operator operator-st">({row.operator})</span>{" "}
          <span className="datetime">
            {intl.formatDate(row.date, {
              ...DATE_TIME_FORMAT,
              weekday: undefined
            })}
          </span>
        </span>
      ),
      sortable: true,
      className: "mb-station m-name"
    },
    {
      // Regionsname <br> (Tirol)
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
      className: "mb-snow m-name"
    },
    {
      // Seehöhe [m]
      data: "elev",
      unit: "m",
      className: "mb-snow m-altitude-1"
    },
    {
      // Schneehöhe [cm]
      group: "snow",
      data: "snow",
      unit: "cm",
      className: "mb-snow m-snowheight"
    },
    ...(["24", "48", "72"] as const).map(
      (hour): Column => ({
        // 24h Differenz Schneehöhe <br> (24h Niederschlag)
        // 48h Differenz Schneehöhe <br> (48h Niederschlag)
        // 72h Differenz Schneehöhe <br> (72h Niederschlag)
        group: "snow",
        data: `snow${hour}`,
        subtitle: "(" + title(`precipitation${hour}`) + ")",
        render: (_value, row) => (
          <>
            <span className={`snow${hour}`} title={title(`snow${hour}`)}>
              {formatNumber(row[`snow${hour}`], "cm")}
            </span>
            {isFinite(row[`precipitation${hour}`]) && (
              <span
                className={`precipitation${hour}`}
                title={title(`precipitation${hour}`)}
              >
                {"("}
                {formatNumber(row[`precipitation${hour}`], "mm")}
                {")"}
              </span>
            )}
          </>
        ),
        unit: "cm",
        className: `mb-snow m-${hour}`
      })
    ),
    {
      // <b>Temperatur jetzt</b> <br> (Temperatur min / Temperatur max)
      group: "temp",
      data: "temp",
      subtitle: "(" + title("temp_min") + " / " + title("temp_max") + ")",
      render: (_value, row) => (
        <>
          <span className="temp" title={title("temp")}>
            {formatNumber(row.temp, "°C", 1)}
          </span>
          {isFinite(row.temp_min) && (
            <span
              className="temp_min_max"
              title={title("temp_min") + " / " + title("temp_max")}
            >
              {"("}
              <span className="temp_min">
                {formatNumber(row.temp_min, "", 1)}
              </span>
              <span className="temp_max">
                {formatNumber(row.temp_max, "", 1)}
              </span>
              {")"}
            </span>
          )}
        </>
      ),
      digits: 1,
      unit: "°C",
      className: "mb-temp m-ltnow"
    },
    {
      // Wind Geschw. / Wind Böe <br> (i18n Wind Richtung)
      group: "wind",
      data: "wspd",
      subtitle: "(" + title("wdir") + ")",
      render: (_value, row) => (
        <>
          <span className="wspd" title={title("wspd")}>
            {formatNumber(row.wspd, row.wgus ? "" : "km/h")}
          </span>
          {row.wgus && (
            <span className="wgus" title={title("wgus")}>
              {formatNumber(row.wgus, "km/h")}
            </span>
          )}
          {row.x_wdir && (
            <span className="wdir" title={title("wdir")}>
              {`(${intl.formatMessage({
                id: "bulletin:report:problem:aspect:" + row.x_wdir.toLowerCase()
              })})`}
            </span>
          )}
        </>
      ),
      unit: "km/h",
      className: "mb-wind m-windspeed"
    }
  ];
  const displayColumns = columns.filter(
    c => !c.group || props.activeData[c.group]
  );

  function formatNumber(
    value: number,
    unit = "",
    digits = 0
  ): string | JSX.Element {
    return typeof value === "number"
      ? intl.formatNumber(value, {
          useGrouping: false,
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        }) + (unit ? "\u202F" + unit : "")
      : "–";
  }

  function _rowClicked(station: StationData) {
    window["modalStateStore"].setData({
      stationData: props.sortedFilteredData,
      rowId: station.id
    });
    ref.current.showModal();
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
        "measurements:table:" +
        (props.sortValue == id ? "sort-toggle" : "sort-" + dir)
    });

  function title(id: keyof StationData) {
    return intl.formatMessage({
      id: "measurements:table:header:" + id
    });
  }

  return (
    <>
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
            <tr key={row.id} onClick={() => _rowClicked(row)}>
              {displayColumns.map(col => (
                <td key={row.id + "-" + col.data} className={col.className}>
                  {col.render && col.render(row[col.data], row, col.unit)}
                  {!col.render && (
                    <span className={col.data} title={title(col.data)}>
                      {formatNumber(row[col.data], col.unit)}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <dialog
        ref={ref}
        onClick={e => e.target == ref.current && ref.current.close()}
      >
        <form method="dialog">
          <WeatherStationDiagrams isOpen={() => ref.current.open} />
        </form>
      </dialog>
    </>
  );
}
