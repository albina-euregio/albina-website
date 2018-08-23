import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl'

class ItemFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentId = this.props.store.activeItem ? this.props.store.activeItem.id : '';
    const ids =
      (this.props.store.activeConfig && this.props.store.activeConfig.items)
        ? this.props.store.activeConfig.items.map((i) => i.id)
        : [];

    const currentIdIndex = ids.indexOf(currentId);

    const prevId = (currentIdIndex > 0) ? ids[currentIdIndex - 1] : '';
    const nextId = (currentIdIndex > -1 && currentIdIndex < ids.length - 1)
      ? ids[currentIdIndex + 1] : '';

    return (
      <div className='grid flipper-left-right'>
        <div className='all-6 grid-item'>
          {prevId &&
            <a href='#'
              className='icon-link tooltip flipper-left'
              title={this.props.intl.formatMessage({
                id: 'weathermap:header:dateflipper:back'
              })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.handleChange(prevId)
              }}
            >
              <span className='icon-arrow-left' />
              &nbsp;{this.props.store.activeConfig.items[currentIdIndex-1].dateCreation}
            </a>}
        </div>
        <div className='all-6 grid-item'>
          {nextId &&
            <a
              href="#"
              className='icon-link tooltip flipper-left'
              title={this.props.intl.formatMessage({
                id: 'weathermap:header:dateflipper:forward'
              })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.handleChange(nextId)
              }}
            >
              {this.props.store.activeConfig.items[currentIdIndex+1].dateCreation}&nbsp;
              <span className='icon-arrow-right' />
            </a>}
        </div>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(ItemFlipper)));
