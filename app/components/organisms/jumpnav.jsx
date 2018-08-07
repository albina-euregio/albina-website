import React from 'react';
import { inject } from 'mobx-react';
import {injectIntl } from 'react-intl';

class Jumpnav extends React.Component {
  render() {
    const entries = [
      {id: 'page-main', title: this.props.intl.formatMessage({id: 'jumpnav:content'})},
      {id: 'navigation', title: this.props.intl.formatMessage({id: 'jumpnav:navigation'})},
      {id: 'page-footer', title: this.props.intl.formatMessage({id: 'jumpnav:footer'})}
    ]
    return (
      <div className="jumpnav">
        { entries.map((e) =>
          <a key={e.id} href={'#' + e.id} title={e.title}>{e.title}</a>
        )}
      </div>
    );
  }
}

export default inject('locale')(injectIntl(Jumpnav));
