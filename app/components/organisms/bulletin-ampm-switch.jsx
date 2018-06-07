import React from 'react';
import {observer} from 'mobx-react';

@observer class BulletinAmPmSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const title = 'Switch to ' + ((this.props.ampm == 'am') ? 'PM' : 'AM');
    return (
      <span className="bulletin-ampm-switch tooltip" title={title}>
        <div className="switch-text">
          <label htmlFor="switch">
            <input id="switch" type="checkbox"></input>
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
