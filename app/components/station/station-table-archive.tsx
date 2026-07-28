import React from "react";
import { useIntl } from "../../i18n";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import DataTable, { type ColumnDef, type SortDir } from "../table/data-table";

interface Props {
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
}

interface ArchiveColumn extends ColumnDef<StationData> {
  group?: keyof Props["activeData"];
}

export default function StationArchiveTable(props: Props) {
  const intl = useIntl();

  function title(id: keyof StationData) {
    return intl.formatMessage({
      id: `measurements:table:header:${id}`
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

  // Per-parameter cell: a download button for the archived measurement file,
  // shown only when the station has a value and an archive file for the season.
  const archiveColumn = (
    id: keyof StationData,
    parameter: string,
    group: keyof Props["activeData"]
  ): ArchiveColumn => ({
    id,
    group,
    title: title(id),
    sortable: false,
    render: row =>
      typeof row[id] === "number" && row.$stationsArchiveFile ? (
        <span title={title(id)}>
          <Tooltip
            label={intl.formatMessage(
              { id: "measurements-archive:table:button:tooltip" },
              {
                parameter: title(id),
                station: row.name,
                season: season(props.activeYear, "/")
              }
            )}
          >
            <a
              href={config.template(row.$stationsArchiveFile, {
                shortName: row.properties.shortName || row.id,
                parameter,
                file: season(props.activeYear, "_")
              })}
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
      ) : null
  });

  const columns: ArchiveColumn[] = [
    {
      // Station (Operator)
      id: "name",
      title: title("name"),
      sortable: true,
      className: "mb-station m-name",
      render: row => (
        <span>
          <strong>{row.name}</strong>{" "}
        </span>
      )
    },
    {
      id: "operator",
      title: title("operator"),
      className: "mb-station m-name",
      render: row => (
        <a
          className="region"
          target="_blank"
          href={row.properties.operatorLink ?? ""}
        >
          {row.operator ?? ""}
        </a>
      )
    },
    {
      // Region name (Province)
      id: "microRegion",
      title: title("microRegion"),
      className: "mb-station m-name",
      render: row => (
        <span className="region" title={row.microRegion}>
          {intl.formatMessage({ id: `region:${row.microRegion}` })}
          {row.province &&
            config.regionCodes.includes(row.province as string) && (
              <span className={`region region-${row.province}`}>
                ({intl.formatMessage({ id: `region:${row.province}` })})
              </span>
            )}
        </span>
      )
    },
    {
      // Observation start
      id: "startYear",
      title: title("startYear"),
      sortable: true,
      className: "mb-station m-name",
      render: row => <span>{row.startYear}</span>
    },
    archiveColumn("HS", "HS", "snow"),
    archiveColumn("TA", "LT", "temp"),
    archiveColumn("TSS", "T0", "temp"),
    archiveColumn("TD", "TP", "temp"),
    archiveColumn("RH", "LF", "temp"),
    archiveColumn("VW", "WG", "wind"),
    archiveColumn("DW", "WR", "wind"),
    archiveColumn("VW_MAX", "WG.Boe", "wind"),
    archiveColumn("ISWR", "GS", "radiation"),
    archiveColumn("RSWR", "GS.unten", "radiation"),
    {
      // SMET raw-file download; not tied to a measurement parameter.
      id: "smet",
      sortable: false,
      title: (
        <Tooltip label="Download as SMET Weather Station Meteorological Data Format">
          <span>SMET</span>
        </Tooltip>
      ),
      render: row =>
        row.properties.dataURLs?.[0] ? (
          <a
            href={config.template(row.properties.dataURLs?.[0], {
              id: row.properties.shortName || row.id
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="pure-button secondary small"
          >
            SMET
          </a>
        ) : null
    }
  ];

  const displayColumns = columns.filter(
    c => !c.group || props.activeData[c.group]
  );

  return (
    <DataTable
      columns={displayColumns}
      rows={props.sortedFilteredData}
      getRowKey={row => String(row.id)}
      sortValue={props.sortValue}
      sortDir={props.sortDir}
      onSort={(id, dir) => props.handleSort(id as keyof StationData, dir)}
      tableClassName="table-measurements"
    />
  );
}
