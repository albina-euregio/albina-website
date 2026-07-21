import React, { type MouseEvent, type ReactNode } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import type { SnowProfileData } from "../../stores/profileDataStore";
import { Tooltip } from "../tooltips/tooltip";

type SortDir = "asc" | "desc";
type SortableField = "location" | "dateTime" | "region";

interface Props {
  sortedFilteredData: SnowProfileData[];
  sortValue: SortableField;
  sortDir: SortDir;
  handleSort: (id: SortableField, dir: SortDir) => void;
  onSnowProfileSelected: (id: string) => void;
}

interface Column {
  data: SortableField;
  title: string;
  render: (row: SnowProfileData) => ReactNode;
}

export default function SnowProfileTable(props: Props) {
  const intl = useIntl();

  const columns: Column[] = [
    {
      data: "dateTime",
      title: intl.formatMessage({ id: "archive:table-header:date" }),
      render: row =>
        row.dateTime
          ? intl.formatDate(row.dateTime, DATE_TIME_FORMAT_SHORT)
          : ""
    },
    {
      data: "location",
      title: intl.formatMessage({ id: "incidents:table:header:location" }),
      render: row => row.location
    },
    {
      data: "region",
      title: intl.formatMessage({
        id: "measurements:table:header:microRegion"
      }),
      render: row =>
        row.region ? <FormattedMessage id={`region:${row.region}`} /> : ""
    }
  ];

  const sortClasses = (id: SortableField, dir: SortDir) => {
    const cls = [dir === "asc" ? "icon-up-open" : "icon-down-open"];
    if (props.sortValue === id && props.sortDir !== dir) {
      cls.push("sort-disabled");
    }
    return cls.join(" ");
  };

  const handleSort = (e: MouseEvent, col: Column, dir: SortDir) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleSort(
      col.data,
      props.sortValue === col.data ? (dir === "asc" ? "desc" : "asc") : dir
    );
  };

  const sortTitle = (id: SortableField, dir: SortDir) =>
    intl.formatMessage({
      id:
        props.sortValue === id
          ? "measurements:table:sort-toggle"
          : `measurements:table:sort-${dir}`
    });

  return (
    <table className="pure-table pure-table-striped pure-table-small table-profiles">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.data}>
              {col.title}
              <span className="sort-buttons">
                {(["asc", "desc"] as SortDir[]).map(dir => (
                  <Tooltip key={dir} label={sortTitle(col.data, dir)}>
                    <a
                      href="#"
                      className={sortClasses(col.data, dir)}
                      onClick={e => handleSort(e, col, dir)}
                    >
                      <span className="is-visually-hidden">
                        {col.title}: {sortTitle(col.data, dir)}
                      </span>
                    </a>
                  </Tooltip>
                ))}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.sortedFilteredData.map(row => (
          <tr key={row.id} onClick={() => props.onSnowProfileSelected(row.id)}>
            {columns.map(col => (
              <td key={row.id + "-" + col.data}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
