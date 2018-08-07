import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';

class SearchField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const placeholder = this.props.intl.formatMessage({id: 'filter:search'});
    return (
      <div>
        <p className="info">{this.props.title}</p>
        <div className="pure-form pure-form-search">
          <input type="text" id="input" placeholder={placeholder} />
          <button href="#" title={placeholder} className="pure-button pure-button-icon icon-search tooltip">
            <span>&nbsp;</span>
          </button>
        </div>
      </div>
    );
  }
}
export default inject('locale')(injectIntl(SearchField));
