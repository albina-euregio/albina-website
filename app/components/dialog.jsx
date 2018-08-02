import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={this.props.id} className={'modal-container' + (window['modalStateStore'].isOpen ? '' : ' mfp-hide') }>
        { this.props.children }
      </div>
    );
  }
}
