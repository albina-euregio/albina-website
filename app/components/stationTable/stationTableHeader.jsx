import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class StationTableHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  get headers() {
    const headerConfig = [
      {id: 'name', cl: 'mb-station m-name', unit: false, sort: false},
      {id: 'elev', cl: 'mb-snow m-altitude-1', unit: 'm', sort: true},
      {id: 'snow', cl: 'mb-snow m-snowheight', unit: 'cm', sort: true},
      {id: 'snow24', cl: 'mb-snow m-24', unit: 'cm', sort: true},
      {id: 'snow48', cl: 'mb-snow m-48', unit: 'cm', sort: true},
      {id: 'snow72', cl: 'mb-snow m-72', unit: 'cm', sort: true},
      {id: 'temp', cl: 'mb-temp m-ltnow', unit: '°C', sort: true},
      {id: 'temp_max', cl: 'mb-temp m-ltmax', unit: '°C', sort: true},
      {id: 'temp_min', cl: 'mb-temp m-ltmin', unit: '°C', sort: true},
      {id: 'wdir', cl: 'mb-wind m-winddir', unit: '°', sort: true},
      {id: 'wspd', cl: 'mb-wind m-windspeed', unit: 'km/h', sort: true},
      {id: 'wgus', cl: 'mb-wind m-windmax', unit: 'km/h', sort: true}
    ];

    headerConfig.forEach((el) => {
      // add titles
      el.title=this.props.intl.formatMessage({
        id: 'measurements:table:header:' + el.id
      })
    });

    return headerConfig;
  }

  render() {
    const sortClasses = (id, dir) => {
      const cls = ["tooltip"];
      if(dir == 'asc') {
        cls.push("sort-ascending");
        cls.push("icon-up-open");
      } else {
        cls.push("sort-descending");
        cls.push("icon-down-open");
      }
      if(this.props.sortValue == id && this.props.sortDir != dir) {
        cls.push("sort-disabled");
      }
      return cls.join(' ');
    };

    return (
      <thead>
        <tr>
          {
            this.headers.map((el, i) => (
              <th key={i}>
                {el.title}
                {el.unit && <span className="measure">{el.unit}</span>}
                {el.sort &&
                  <span className="sort-buttons">
                    { ['asc', 'desc'].map((dir) =>
                      <a
                        key={dir}
                        href="#"
                        className={sortClasses(el.id, dir)}
                        title={this.props.intl.formatMessage({
                          id: "measurements:table:sort-" + dir
                        })}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.props.handleSort(
                            el.id,
                            (this.props.sortValue == el.id)
                              ? (
                                (this.props.sortDir == 'asc') ? 'desc' : 'asc'
                              )
                              : dir
                          );
                        }}
                        />
                    )}
                  </span>
                }
              </th>
            ))
          }
        </tr>
      </thead>
    )
  }
}

export default inject("locale")(injectIntl(StationTableHeader));
