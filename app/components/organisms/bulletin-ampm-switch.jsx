import React from 'react';
import {observer} from 'mobx-react';

@observer class BulletinAmPmSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle(event) {
    const target = event.target;
    const value = target.checked ? 'pm' : 'am';
    if(window['bulletinStore'].settings.ampm != value) {
      window['bulletinStore'].setAmPm(value);
    }
  }

  render() {
    const title = 'Switch to ' + ((this.props.store.settings.ampm == 'am') ? 'PM' : 'AM');
    const enabled = (this.props.store.settings.status == 'ok') ?
      this.props.store.activeBulletinCollection.hasDaytimeDependency(): false;

    return (enabled &&
      <span className="bulletin-ampm-switch tooltip" title={title}>
        <div className="switch-text">
          <label htmlFor="switch">
            <input id="switch" type="checkbox"
              onChange={e => this.toggle(e)}
              checked={this.props.store.settings.ampm == 'pm'}></input>
            <div className="slider">
              <span>AM</span>
              <span>PM</span>
            </div>
          </label>
        </div>
      </span>
    );
  }
}

export default BulletinAmPmSwitch;
