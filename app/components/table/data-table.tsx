import React, { type MouseEvent, type ReactNode } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

export type SortDir = "asc" | "desc";

export interface ColumnDef<T> {
  /** Stable key, doubling as the sort id sent to `onSort`. */
  id: string;
  /** Header label. */
  title: ReactNode;
  /** Optional second header line (e.g. units/subtitle). */
  subtitle?: ReactNode;
  /** CSS class(es) applied to the `<td>`. */
  className?: string;
  render: (row: T) => ReactNode;
  /** Defaults to `true`; set `false` to render a header without sort controls. */
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  sortValue: string;
  sortDir: SortDir;
  onSort: (id: string, dir: SortDir) => void;
  onRowClick?: (row: T) => void;
  /** Extra table class, e.g. `table-incidents` / `table-measurements`. */
  tableClassName?: string;
}

export default function DataTable<T>(props: DataTableProps<T>) {
  const intl = useIntl();

  const sortClasses = (id: string, dir: SortDir) => {
    const cls = [dir === "asc" ? "icon-up-open" : "icon-down-open"];
    if (props.sortValue === id && props.sortDir !== dir) {
      cls.push("sort-disabled");
    }
    return cls.join(" ");
  };

  const handleSort = (e: MouseEvent, col: ColumnDef<T>, dir: SortDir) => {
    e.preventDefault();
    e.stopPropagation();
    props.onSort(
      col.id,
      props.sortValue === col.id ? (dir === "asc" ? "desc" : "asc") : dir
    );
  };

  const sortTitle = (id: string, dir: SortDir) =>
    intl.formatMessage({
      id:
        props.sortValue === id
          ? "measurements:table:sort-toggle"
          : `measurements:table:sort-${dir}`
    });

  return (
    <table
      className={`pure-table pure-table-striped pure-table-small data-table ${props.tableClassName ?? ""}`}
    >
      <thead>
        <tr>
          {props.columns.map(col => (
            <th key={col.id}>
              {col.title}
              {col.subtitle && <br />}
              {col.subtitle}
              {col.sortable !== false && (
                <span className="sort-buttons">
                  {(["asc", "desc"] as SortDir[]).map(dir => (
                    <Tooltip key={dir} label={sortTitle(col.id, dir)}>
                      <a
                        href="#"
                        className={sortClasses(col.id, dir)}
                        onClick={e => handleSort(e, col, dir)}
                      >
                        <span className="is-visually-hidden">
                          {col.title}: {sortTitle(col.id, dir)}
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
        {props.rows.map(row => {
          const key = props.getRowKey(row);
          return (
            <tr key={key} onClick={() => props.onRowClick?.(row)}>
              {props.columns.map(col => (
                <td key={key + "-" + col.id} className={col.className}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
