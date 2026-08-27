import React from "react";
import { useIntl } from "../../i18n";
import { useIncidentReportMessages } from "../../i18n/incident-report";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import { involvementText } from "../../util/incident-involvement";
import { avalancheBadgeText } from "../../util/incident-badges";
import { IncidentBadge } from "./incident-badge";
import type {
  IncidentData,
  SortableField
} from "../../stores/incidentDataStore";
import DataTable, { type ColumnDef, type SortDir } from "../table/data-table";
import RegionCell from "../table/region-cell";

interface Props {
  sortedFilteredData: IncidentData[];
  sortValue: SortableField;
  sortDir: SortDir;
  handleSort: (id: SortableField, dir: SortDir) => void;
  onIncidentSelected: (id: string) => void;
}

export default function IncidentTable(props: Props) {
  const intl = useIntl();
  const messages = useIncidentReportMessages();
  // Column headers come from the async-loaded `incident-report` Transifex
  // resource (see i18n/incident-report.ts); fall back to the raw field name
  // until it loads / if a label is missing.
  const label = (field: string) => messages.incidentReport?.[field] ?? field;

  const columns: ColumnDef<IncidentData>[] = [
    {
      id: "dateTime",
      title: intl.formatMessage({ id: "archive:table-header:date" }),
      align: "right",
      defaultSortDir: "desc",
      render: row =>
        row.dateTime
          ? intl.formatDate(row.dateTime, DATE_TIME_FORMAT_SHORT)
          : ""
    },
    {
      id: "location",
      title:
        messages.incidentReport?.location ??
        intl.formatMessage({ id: "incidents:table:header:location" }),
      render: row => row.location
    },
    {
      id: "personInvolvement",
      title: label("personInvolvement"),
      align: "left",
      // A severity dot — the same circle as the map marker and legend swatch —
      // sits before the outcome so colour and wording agree.
      render: row => (
        <span className="incident-involvement">
          <span
            className="incident-involvement-dot"
            style={{
              background: `var(--incident-involvement-${row.involvement})`
            }}
          />
          {involvementText(row, intl)}
        </span>
      )
    },
    {
      id: "region",
      title: intl.formatMessage({
        id: "measurements:table:header:microRegion"
      }),
      render: row => (
        <RegionCell microRegion={row.microRegion} province={row.region} />
      )
    },
    {
      id: "avalancheType",
      title: label("avalancheType"),
      render: row => {
        const text = avalancheBadgeText(row, messages, "avalancheType");
        return text ? <IncidentBadge>{text}</IncidentBadge> : "";
      }
    },
    {
      id: "avalancheSize",
      title: intl.formatMessage({ id: "caaml:avalancheSize.label" }),
      render: row => {
        const text = avalancheBadgeText(row, messages, "avalancheSize");
        return text ? <IncidentBadge>{text}</IncidentBadge> : "";
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      rows={props.sortedFilteredData}
      getRowKey={row => row.id}
      sortValue={props.sortValue}
      sortDir={props.sortDir}
      onSort={(id, dir) => props.handleSort(id as SortableField, dir)}
      onRowClick={row => props.onIncidentSelected(row.id)}
      tableClassName="table-incidents"
    />
  );
}
