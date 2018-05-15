import React from 'react';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

@observer class BulletinAmPmSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      (this.props.bulletin.ampm == 'am') ? (
        <span><span className="bulletin-ampm"><a href="#" title="Switch to PM" className="textlink tooltip">PM</a></span> <span title="AM is currently selected" className="bulletin-ampm tooltip">AM</span></span>
      ) : (
        <span><span title="PM is currently selected" className="bulletin-ampm tooltip">PM</span> <span className="bulletin-ampm"><a href="#" title="Switch to AM" className="textlink tooltip">AM</a></span></span>
      )
    );
  }
}

export default BulletinAmPmSwitch;
