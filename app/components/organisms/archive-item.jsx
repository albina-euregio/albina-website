import React from 'react';
import { dateToISODateString, dateToDateString } from '../../util/date.js';

export default class ArchiveItem extends React.Component {
  get previewMap() {
    // TODO: fix daytime
    return window['config'].get('apis.geo')
      + dateToISODateString(this.props.date)
      + '/am_albina_thumbnail.jpg';
  }

  render() {
    return (
      <tr>
        <td><strong>{dateToDateString(this.props.date)}</strong></td>
        <td>
          <ul className="list-inline list-download">
            <li><a href="#" title="Download" className="small secondary pure-button tooltip">PDF</a>
            </li>
            <li><a href="#" title="Download" className="small secondary pure-button tooltip">XML</a>
            </li>
          </ul>
        </td>
        <td>
          <a href="#" className="map-preview img tooltip" title="Show full archived forecast">
            <img src={this.previewMap} alt="Region" />
          </a>
        </td>
      </tr>
    );
  }
}
