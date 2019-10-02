import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";

class ItemFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lang = appStore.language;
    const previousItem = this.props.store.previousItem;
    const nextItem = this.props.store.nextItem;

    return (
      <div className="grid flipper-left-right">
        <div className="all-6 grid-item">
          {previousItem && (
            <a
              href="#"
              className="icon-link tooltip flipper-left"
              /* title={this.props.intl.formatMessage({
                id: 'weathermap:header:dateflipper:back'
              })} */
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.props.handleChange(previousItem.id);
              }}
            >
              <span className="icon-arrow icon-arrow-left" />
              &nbsp;
              {previousItem.descriptionTimeSpan[lang]}
            </a>
          )}
        </div>
        <div className="all-6 grid-item">
          {nextItem && (
            <a
              href="#"
              className="icon-link tooltip flipper-left"
              /* title={this.props.intl.formatMessage({
                id: 'weathermap:header:dateflipper:forward'
              })} */
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.props.handleChange(nextItem.id);
              }}
            >
              {nextItem.descriptionTimeSpan[lang]}
              &nbsp;
              <span className="icon-arrow icon-arrow-right" />
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(ItemFlipper)));
