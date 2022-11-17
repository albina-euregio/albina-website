import React from "react";
import { useIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

const StationTableHeader = props => {
  const intl = useIntl();

  const sortClasses = (id, dir) => {
    const cls = [];
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

  const toggleSortDir = dir => (dir == "asc" ? "desc" : "asc");

  const sortTitle = (id, dir) =>
    intl.formatMessage({
      id:
        "measurements:table:" +
        (props.sortValue == id ? "sort-toggle" : "sort-" + dir)
    });

  const title = id =>
    intl.formatMessage({
      id: "measurements:table:header:" + id
    });

  return (
    <thead>
      <tr>
        {props.columns.map(
          (el, i) =>
            props.isDisplayColumn(el) && (
              <th key={i}>
                {title(el.data)}
                {el.unit && <span className="measure">{el.unit}</span>}
                {el.sortable !== false && (
                  <span className="sort-buttons">
                    {["asc", "desc"].map(dir => (
                      <Tooltip key={dir} label={sortTitle(el.data, dir)}>
                        <a
                          href="#"
                          className={sortClasses(el.data, dir)}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            props.handleSort(
                              el.data,
                              props.sortValue == el.data
                                ? toggleSortDir(dir)
                                : dir
                            );
                          }}
                        >
                          <span className="is-visually-hidden">
                            {title(el.data)}: {sortTitle(el.data, dir)}
                          </span>
                        </a>
                      </Tooltip>
                    ))}
                  </span>
                )}
              </th>
            )
        )}
      </tr>
    </thead>
  );
};

export default StationTableHeader;
