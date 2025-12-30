import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { DATE_TIME_FORMAT } from "../../util/date";
import { type StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import WeatherStationDialog, {
  useStationId
} from "../dialogs/weather-station-dialog";

type SortDir = "desc" | "asc";

interface Props {
  activeData: {
    snow: boolean;
    temp: boolean;
    wind: boolean;
  };
  handleSort: (id: keyof StationData, dir: SortDir) => void;
  sortValue: keyof StationData;
  sortDir: SortDir;
  sortedFilteredData: StationData[];
}

interface Column {
  data: keyof StationData;
  subtitle?: string;
  render: (row: StationData) => React.ReactElement;
  sortable?: boolean;
  className: string;
  unit?: string;
  group?: keyof Props["activeData"];
  digits?: number;
}

export default function StationTable(props: Props) {
  const intl = useIntl();
  const [stationId, setStationId] = useStationId();

  const columns: Column[] = [
    {
      // Station (Betreiber) <br> Zeitstempel
      data: "name",
      render: row => (
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
      render: row =>
        row.microRegion ? (
          <span className="region" title={row.microRegion}>
            <FormattedMessage id={`region:${row.microRegion}`} />
            {row.province &&
              config.regionCodes.includes(row.province as string) && (
                <span className={`region region-${row.province}`}>
                  <FormattedMessage id={`region:${row.province}`} />
                </span>
              )}
          </span>
        ) : (
          <></>
        ),
      className: "mb-snow m-name"
    },
    {
      // Seehöhe [m]
      data: "elev",
      render(row) {
        return (
          <span className={this.data} title={title(this.data)}>
            {intl.formatNumberUnit(row[this.data], this.unit)}
          </span>
        );
      },
      unit: "m",
      className: "mb-snow m-altitude-1"
    },
    {
      // Schneehöhe [cm]
      group: "snow",
      data: "snow",
      render(row) {
        return (
          <span className={this.data} title={title(this.data)}>
            {intl.formatNumberUnit(row[this.data], this.unit)}
          </span>
        );
      },
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
        render(row) {
          return (
            <>
              <span className={`snow${hour}`} title={title(`snow${hour}`)}>
                {intl.formatNumberUnit(row[`snow${hour}`], this.unit)}
              </span>
              {isFinite(row[`precipitation${hour}`]) && (
                <span
                  className={`precipitation${hour}`}
                  title={title(`precipitation${hour}`)}
                >
                  {"("}
                  {intl.formatNumberUnit(row[`precipitation${hour}`], "mm")}
                  {")"}
                </span>
              )}
            </>
          );
        },
        unit: "cm",
        className: `mb-snow m-${hour}`
      })
    ),
    {
      // <b>Temperatur jetzt</b> <br> (Temperatur min / Temperatur max)
      group: "temp",
      data: "temp",
      subtitle: "(" + title("temp_min") + " / " + title("temp_max") + ")",
      render(row) {
        return (
          <>
            <span className="temp" title={title("temp")}>
              {intl.formatNumberUnit(row.temp, this.unit, 1)}
            </span>
            {isFinite(row.temp_min) && (
              <span
                className="temp_min_max"
                title={title("temp_min") + " / " + title("temp_max")}
              >
                {"("}
                <span className="temp_min">
                  {intl.formatNumberUnit(row.temp_min, undefined, 1)}
                </span>
                <span className="temp_max">
                  {intl.formatNumberUnit(row.temp_max, undefined, 1)}
                </span>
                {")"}
              </span>
            )}
          </>
        );
      },
      digits: 1,
      unit: "°C",
      className: "mb-temp m-ltnow"
    },
    {
      // Wind Geschw. / Wind Böe <br> (i18n Wind Richtung)
      group: "wind",
      data: "wspd",
      subtitle: "(" + title("wdir") + ")",
      render(row) {
        return (
          <>
            <span className="wspd" title={title("wspd")}>
              {intl.formatNumberUnit(row.wspd, row.wgus ? "" : this.unit)}
            </span>
            {row.wgus && (
              <span className="wgus" title={title("wgus")}>
                {intl.formatNumberUnit(row.wgus, this.unit)}
              </span>
            )}
            {row.x_wdir && (
              <span className="wdir" title={title("wdir")}>
                <FormattedMessage
                  id={
                    "bulletin:report:problem:aspect:" + row.x_wdir.toLowerCase()
                  }
                />
              </span>
            )}
          </>
        );
      },
      unit: "km/h",
      className: "mb-wind m-windspeed"
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
      {!!props.sortedFilteredData.length && (
        <WeatherStationDialog
          stationData={props.sortedFilteredData}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}
      <table className="pure-table pure-table-striped pure-table-small table-measurements">
        <thead>
          <StationTableHeaderRow
            displayColumns={displayColumns}
            handleSort={handleSort}
            sortClasses={sortClasses}
            sortTitle={sortTitle}
            title={title}
          />
        </thead>

        <tbody>
          {props.sortedFilteredData.map((row: StationData) => (
            <StationTableDataRow
              displayColumns={displayColumns}
              key={row.id}
              row={row}
              setStationId={setStationId}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

function StationTableHeaderRow({
  displayColumns,
  title,
  sortTitle,
  sortClasses,
  handleSort
}: {
  displayColumns: Column[];
  title: (id: keyof StationData) => string;
  sortTitle: (id: keyof StationData, dir: SortDir) => string;
  sortClasses: (id: keyof StationData, dir: SortDir) => string;
  handleSort: (e: React.MouseEvent, col: Column, dir: SortDir) => void;
}) {
  return (
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
  );
}

function StationTableDataRow({
  row,
  setStationId,
  displayColumns
}: {
  row: StationData;
  setStationId: (value: ((prevState: string) => string) | string) => void;
  displayColumns: Column[];
}) {
  return (
    <tr key={row.id} onClick={() => setStationId(row.id)}>
      {displayColumns.map(col => (
        <td key={row.id + "-" + col.data} className={col.className}>
          {col.render(row)}
        </td>
      ))}
    </tr>
  );
}
