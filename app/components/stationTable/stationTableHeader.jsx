import React from "react";
import { injectIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

class StationTableHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sortClasses = (id, dir) => {
      const cls = [];
      if (dir == "asc") {
        cls.push("sort-ascending");
        cls.push("icon-up-open");
      } else {
        cls.push("sort-descending");
        cls.push("icon-down-open");
      }
      if (this.props.sortValue == id && this.props.sortDir != dir) {
        cls.push("sort-disabled");
      }
      return cls.join(" ");
    };

    const toggleSortDir = dir => (dir == "asc" ? "desc" : "asc");

    const sortTitle = (id, dir) =>
      this.props.intl.formatMessage({
        id:
          "measurements:table:" +
          (this.props.sortValue == id ? "sort-toggle" : "sort-" + dir)
      });

    const title = id =>
      this.props.intl.formatMessage({
        id: "measurements:table:header:" + id
      });

    return (
      <thead>
        <tr>
          {this.props.columns.map(
            (el, i) =>
              this.props.isDisplayColumn(el) && (
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
                              this.props.handleSort(
                                el.data,
                                this.props.sortValue == el.data
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
  }
}

export default injectIntl(StationTableHeader);
