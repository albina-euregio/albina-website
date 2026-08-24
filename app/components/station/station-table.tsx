import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import { type StationData } from "../../stores/stationDataStore";
import { useStationId } from "./station-dialog";
import DataTable, { type ColumnDef } from "../table/data-table";
import RegionCell from "../table/region-cell";

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

interface StationColumn extends ColumnDef<StationData> {
  group?: keyof Props["activeData"];
}

export default function StationTable(props: Props) {
  const intl = useIntl();
  const [, setStationId] = useStationId();

  function title(id: keyof StationData) {
    return intl.formatMessage({
      id: `measurements:table:header:${id}`
    });
  }

  const columns: StationColumn[] = [
    {
      // Station (Betreiber) <br> Zeitstempel
      id: "name",
      title: title("name"),
      render: row => (
        <span>
          <strong>{row.name}</strong>{" "}
          <span className="datetime">
            {intl.formatDate(row.date, DATE_TIME_FORMAT_SHORT)}
          </span>
        </span>
      ),
      className: "mb-station m-name"
    },
    {
      id: "operator",
      title: title("operator"),
      render: row => (
        <a
          className="region"
          target="_blank"
          href={row.properties.operatorLink ?? ""}
        >
          {row.operator ?? ""}
        </a>
      ),
      className: "mb-station m-name"
    },
    {
      // Regionsname <br> (Tirol)
      id: "microRegion",
      title: title("microRegion"),
      render: row => (
        <RegionCell microRegion={row.microRegion} province={row.province} />
      ),
      className: "mb-snow m-name"
    },
    {
      // Seehöhe [m]
      id: "altitude",
      title: title("altitude"),
      render: row => (
        <span className="altitude" title={title("altitude")}>
          {intl.formatNumberUnit(row.altitude, "m")}
        </span>
      ),
      className: "mb-snow m-altitude-1"
    },
    {
      // Schneehöhe [cm]
      group: "snow",
      id: "HS",
      title: title("HS"),
      render: row => (
        <span className="HS" title={title("HS")}>
          {intl.formatNumberUnit(row.HS, "cm")}
        </span>
      ),
      className: "mb-snow m-snowheight"
    },
    ...(
      [
        ["HSD_24", "PSUM_24"],
        ["HSD_48", "PSUM_48"],
        ["HSD_72", "PSUM_72"]
      ] as const
    ).map(
      ([hsd, psum]): StationColumn => ({
        // 24h/48h/72h Differenz Schneehöhe <br> (24h/48h/72h Niederschlag)
        group: "snow",
        id: hsd,
        title: title(hsd),
        subtitle: "(" + title(psum) + ")",
        render: row => (
          <>
            <span className={hsd} title={title(hsd)}>
              {intl.formatNumberUnit(row[hsd], "cm")}
            </span>
            {isFinite(row[psum]) && (
              <span className={psum} title={title(psum)}>
                {"("}
                {intl.formatNumberUnit(row[psum], "mm")}
                {")"}
              </span>
            )}
          </>
        ),
        className: `mb-snow m-${hsd}`
      })
    ),
    {
      // <b>Temperatur jetzt</b> <br> (Temperatur min / Temperatur max)
      group: "temp",
      id: "TA",
      title: title("TA"),
      subtitle: "(" + title("TA_MIN") + " / " + title("TA_MAX") + ")",
      render: row => (
        <>
          <span className="temp" title={title("TA")}>
            {intl.formatNumberUnit(row.TA, "℃", 1)}
          </span>
          {isFinite(row.TA_MIN) && (
            <span
              className="TA_MIN_max"
              title={title("TA_MIN") + " / " + title("TA_MAX")}
            >
              {"("}
              <span className="TA_MIN">
                {intl.formatNumberUnit(row.TA_MIN, undefined, 1)}
              </span>
              <span className="TA_MAX">
                {intl.formatNumberUnit(row.TA_MAX, undefined, 1)}
              </span>
              {")"}
            </span>
          )}
        </>
      ),
      className: "mb-temp m-ltnow"
    },
    {
      // Surface Temp.
      group: "temp",
      id: "TSS",
      title: title("TSS"),
      render: row => (
        <span className="TSS" title={title("TSS")}>
          {intl.formatNumberUnit(row.TSS, "℃")}
        </span>
      ),
      className: "mb-temp"
    },
    {
      // Rel. humidity [%]
      group: "temp",
      id: "RH",
      title: title("RH"),
      render: row => (
        <span className="RH" title={title("RH")}>
          {intl.formatNumberUnit(row.RH, "%")}
        </span>
      ),
      className: "mb-temp"
    },
    {
      // Wind Geschw. / Wind Böe <br> (i18n Wind Richtung)
      group: "wind",
      id: "VW",
      title: title("VW"),
      subtitle: "(" + title("DW") + ")",
      render: row => (
        <>
          <span className="VW" title={title("VW")}>
            {intl.formatNumberUnit(row.VW, row.VW_MAX ? "" : "km/h")}
          </span>
          {row.VW_MAX && (
            <span className="VW_MAX" title={title("VW_MAX")}>
              {intl.formatNumberUnit(row.VW_MAX, "km/h")}
            </span>
          )}
          {row.aspectDW && (
            <span className="DW" title={title("DW")}>
              <FormattedMessage
                id={
                  "bulletin:report:problem:aspect:" + row.aspectDW.toLowerCase()
                }
              />
            </span>
          )}
        </>
      ),
      className: "mb-wind m-windspeed"
    }
  ];

  const displayColumns = columns.filter(
    c => !c.group || props.activeData[c.group]
  );

  return (
    <>
      <DataTable
        columns={displayColumns}
        rows={props.sortedFilteredData}
        getRowKey={row => String(row.id)}
        sortValue={props.sortValue}
        sortDir={props.sortDir}
        onSort={(id, dir) => props.handleSort(id as keyof StationData, dir)}
        onRowClick={row => setStationId(String(row.id))}
        tableClassName="table-measurements"
      />
    </>
  );
}
