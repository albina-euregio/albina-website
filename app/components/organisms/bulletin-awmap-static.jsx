import React from 'react';
import {observer} from 'mobx-react';

@observer class BulletinAWMapStatic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const path = window['config'].get('projectRoot') + 'images/dev/bulletin-report-region.png';
    const text = 'Selected region + ' + this.props.region;
    return (
      <img src={path} alt={text} />
    );
  }
}

export default BulletinAWMapStatic;
