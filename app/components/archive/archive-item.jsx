import React from 'react';
import { Link } from 'react-router-dom';
import stringInject from 'stringinject';
import { dateToISODateString, dateToDateString } from '../../util/date.js';

export default class ArchiveItem extends React.Component {
  get previewMap() {
    // TODO: fix daytime
    return window['config'].get('apis.geo')
      + dateToISODateString(this.props.date)
      + '/am_albina_thumbnail.jpg';
  }

  render() {
    const dateString = dateToISODateString(this.props.date);
    return (
      <tr>
        <td><strong>{dateToDateString(this.props.date)}</strong></td>
        <td>
          <ul className="list-inline list-download">
            <li>
              <a href={stringInject(config.get('links.downloads.pdf'), {date: dateString})}
                title="Download"
                className="small secondary pure-button tooltip">PDF</a>
            </li>
            <li>
              <a href={stringInject(config.get('links.downloads.pdf'), {date: dateString})}
                title="Download"
                className="small secondary pure-button tooltip">XML</a>
            </li>
          </ul>
        </td>
        <td>
          <Link to={'/bulletin/' + dateString} className="map-preview img tooltip" title="Show full archived forecast">
            <img src={this.previewMap} alt="Region" />
          </Link>
        </td>
      </tr>
    );
  }
}
