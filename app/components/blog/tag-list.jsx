import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';

class TagList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(Array.isArray(this.props.tags) && this.props.tags.length > 0) {
      return (
        <ul className="list-inline blog-list-labels">
          {
            this.props.tags.map((t, i) =>
              <li key={i}><span className="label">{this.props.intl.formatMessage({id: 'problem:' + t})}</span></li>
            )
          }
        </ul>
      );
    }
    return null;
  }
}

export default inject('locale')(injectIntl(TagList));
