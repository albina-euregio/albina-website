import React from "react";
import { FormattedMessage, useIntl, type MessageId } from "../../i18n";
import {
  translateIncidentValue,
  useIncidentReportMessages
} from "../../i18n/incident-report";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import { getDangerRatingLabel } from "../../util/warn-levels";
import type {
  IncidentData,
  SortableField
} from "../../stores/incidentDataStore";
import DataTable, { type ColumnDef, type SortDir } from "../table/data-table";

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
      id: "region",
      title: intl.formatMessage({
        id: "measurements:table:header:microRegion"
      }),
      render: row => <FormattedMessage id={`region:${row.region}`} />
    },
    {
      id: "dangerRating",
      title: label("dangerRating"),
      render: row =>
        row.dangerRating
          ? getDangerRatingLabel(
              row.dangerRating,
              intl.formatMessage({
                id: `danger-level:${row.dangerRating}` as MessageId
              })
            )
          : ""
    },
    {
      id: "avalancheType",
      title: label("avalancheType"),
      render: row =>
        translateIncidentValue(messages, "avalancheType", row.avalancheType) ??
        ""
    },
    {
      id: "avalancheSize",
      title: label("avalancheSize"),
      render: row =>
        translateIncidentValue(messages, "avalancheSize", row.avalancheSize) ??
        ""
    },
    {
      id: "personInvolvement",
      title: label("personInvolvement"),
      render: row =>
        translateIncidentValue(
          messages,
          "personInvolvement",
          row.personInvolvement
        ) ?? ""
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
