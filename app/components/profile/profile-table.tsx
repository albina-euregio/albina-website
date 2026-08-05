import React, { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import {
  stabilityLabelId,
  type SnowProfileData
} from "../../stores/profileDataStore";
import DataTable, { type ColumnDef, type SortDir } from "../table/data-table";

type SortableField = "location" | "dateTime" | "region" | "stability";

interface Props {
  sortedFilteredData: SnowProfileData[];
  sortValue: SortableField;
  sortDir: SortDir;
  handleSort: (id: SortableField, dir: SortDir) => void;
  onSnowProfileSelected: (id: string) => void;
}

export default function SnowProfileTable(props: Props) {
  const intl = useIntl();

  const columns: ColumnDef<SnowProfileData>[] = [
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
      title: intl.formatMessage({ id: "incidents:table:header:location" }),
      render: row => row.location
    },
    {
      id: "region",
      title: intl.formatMessage({
        id: "measurements:table:header:microRegion"
      }),
      render: (row): ReactNode =>
        row.region ? <FormattedMessage id={`region:${row.region}`} /> : ""
    },
    {
      id: "stability",
      title: intl.formatMessage({ id: "profiles:table:header:stability" }),
      className: "table-profiles__stability",
      render: (row): ReactNode =>
        row.stability ? (
          <span
            className={`snowprofile-stability-badge snowprofile-stability-badge--${row.stability}`}
          >
            {intl.formatMessage({ id: stabilityLabelId(row.stability) })}
          </span>
        ) : (
          ""
        )
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
      onRowClick={row => props.onSnowProfileSelected(row.id)}
      tableClassName="table-profiles"
    />
  );
}
