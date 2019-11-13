import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class StationTableHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sortClasses = (id, dir) => {
      const cls = ["tooltip"];
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
          {this.props.columns.map((el, i) => (
            <th key={i}>
              {title(el.data)}
              {el.unit && <span className="measure">{el.unit}</span>}
              {el.sortable !== false && (
                <span className="sort-buttons">
                  {["asc", "desc"].map(dir => (
                    <a
                      key={dir}
                      href="#"
                      className={sortClasses(el.data, dir)}
                      title={sortTitle(el.data, dir)}
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
                    />
                  ))}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default inject("locale")(injectIntl(StationTableHeader));
