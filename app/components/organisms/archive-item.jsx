import React from 'react';
import { dateToISODateString, dateToDateString } from '../../util/date.js';

export default class ArchiveItem extends React.Component {
  get status() {
    return window['archiveStore'].getStatus(dateToISODateString(this.props.date));
  }

  get regionText() {
    // TODO localise
    const regionTexts = {
      'tyrol': 'Tyrol',
      'southtyrol': 'South Tyrol',
      'trentino': 'Trentino'
    };

    return regionTexts[this.props.region];
  }

  get previewMap() {
    // TODO: fix daytime
    return window['config'].get('apis.geo')
      + dateToISODateString(this.props.date)
      + '/am_' + this.props.region + '_map.jpg';
  }

  render() {
    return (this.status == 'ok' &&
      <tr key={this.props.date.getTime() + this.props.region}>
        <td><strong>{dateToDateString(this.props.date)}</strong></td>
        <td><span className="region">{this.regionText}</span></td>
        <td>
          <ul className="list-inline list-download">
            <li><a href="#" title="Download" className="small secondary pure-button tooltip">PDF</a>
            </li>
            <li><a href="#" title="Download" className="small secondary pure-button tooltip">XML</a>
            </li>
          </ul>
        </td>
        <td>
          <a href="#" className="map-preview img tooltip" title="Map Preview">
            <img src={this.previewMap} alt="Region" />
          </a>
        </td>
      </tr>
    );
  }
}
