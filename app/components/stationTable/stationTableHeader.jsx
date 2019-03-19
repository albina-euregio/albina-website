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
      {id: 'elev', cl: 'mb-snow m-altitude-1', unit: true, sort: true},
      {id: 'snow', cl: 'mb-snow m-snowheight', unit: true, sort: true},
      {id: 'snow24', cl: 'mb-snow m-24', unit: true, sort: true},
      {id: 'snow48', cl: 'mb-snow m-48', unit: true, sort: true},
      {id: 'snow72', cl: 'mb-snow m-72', unit: true, sort: true},
      {id: 'temp', cl: 'mb-temp m-ltnow', unit: true, sort: true},
      {id: 'temp_max', cl: 'mb-temp m-ltmax', unit: true, sort: true},
      {id: 'temp_min', cl: 'mb-temp m-ltmin', unit: true, sort: true},
      {id: 'wdir', cl: 'mb-wind m-winddir', unit: true, sort: true},
      {id: 'wspd', cl: 'mb-wind m-windspeed', unit: true, sort: true},
      {id: 'wgus', cl: 'mb-wind m-windmax', unit: true, sort: true}
    ];
    headerConfig.forEach((el) => {
      el.title=this.props.intl.formatMessage({
        id: 'measurements:table:header:' + el.id
      })
    });
    return headerConfig;
  }

  render() {
    const headers = this.headers;
    return (
      <thead>
        <tr>
          {
            headers.map((el, i) => {(
              <th key={i}>
                {el.title}
                {el.unit && <span className="measure"></span>}
                {el.sort &&
                  <span className="sort-buttons">
                    <a href="#"
                      className="sort-ascending icon-up-open tooltip"
                      title={this.props.intl.formatMessage({
                        id: "measurements:table:sort-asc"
                      })} />
                    <a href="#"
                      className="sort-descending icon-down-open tooltip"
                      title={this.props.intl.formatMessage({
                        id: "measurements:table:sort-desc"
                      })} />
                  </span>
                }
              </th>
            )})
          }
        </tr>
      </thead>
    )
  }
}

export default inject("locale")(injectIntl(StationTableHeader));
