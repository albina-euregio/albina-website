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
  /**
   * Horizontal alignment for this column's header and cells. Overrides the
   * table's default (first column left, the rest centered).
   */
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
  /** Defaults to `true`; set `false` to render a header without sort controls. */
  sortable?: boolean;
  /** Direction applied when this column is first clicked. Defaults to `"asc"`. */
  defaultSortDir?: SortDir;
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

  const handleSort = (e: MouseEvent, col: ColumnDef<T>) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle direction on the active column, otherwise use the column's
    // preferred first direction.
    const dir: SortDir =
      props.sortValue === col.id
        ? props.sortDir === "asc"
          ? "desc"
          : "asc"
        : (col.defaultSortDir ?? "asc");
    props.onSort(col.id, dir);
  };

  const sortTitle = (col: ColumnDef<T>) =>
    intl.formatMessage({
      id:
        props.sortValue === col.id
          ? "measurements:table:sort-toggle"
          : `measurements:table:sort-${col.defaultSortDir ?? "asc"}`
    });

  return (
    <table
      className={`pure-table pure-table-striped pure-table-small data-table ${props.tableClassName ?? ""}`}
    >
      <thead>
        <tr>
          {props.columns.map(col => {
            const sortable = col.sortable !== false;
            const active = sortable && props.sortValue === col.id;
            const asc = props.sortDir === "asc";
            const label = (
              <span className="sort-header-inner">
                <span className="sort-header-text">
                  {col.title}
                  {col.subtitle && <br />}
                  {col.subtitle}
                </span>
                {active && (
                  <span
                    className={`sort-caret ${
                      asc ? "icon-down-open" : "icon-up-open"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </span>
            );
            return (
              <th
                key={col.id}
                style={col.align ? { textAlign: col.align } : undefined}
                aria-sort={
                  active ? (asc ? "ascending" : "descending") : undefined
                }
              >
                {sortable ? (
                  <Tooltip label={sortTitle(col)}>
                    <a
                      href="#"
                      className="sort-header"
                      onClick={e => handleSort(e, col)}
                    >
                      {label}
                    </a>
                  </Tooltip>
                ) : (
                  label
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {props.rows.map(row => {
          const key = props.getRowKey(row);
          return (
            <tr key={key} onClick={() => props.onRowClick?.(row)}>
              {props.columns.map(col => (
                <td
                  key={key + "-" + col.id}
                  className={col.className}
                  style={col.align ? { textAlign: col.align } : undefined}
                >
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
