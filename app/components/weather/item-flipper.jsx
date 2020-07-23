import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";

class ItemFlipper extends React.Component {
  constructor(props) {
    super(props);

    // let itemsDirUp = true;
    // let store = this.props.store;
    // setInterval(()=>{
    //   if(itemsDirUp) {
    //     if(store.nextItem) this.props.handleChange(store.nextItem.id);
    //     else itemsDirUp = !itemsDirUp;
    //   } else {
    //     if(store.previousItem) this.props.handleChange(store.previousItem.id);
    //     else itemsDirUp = !itemsDirUp;
    //   }

    // }, 2000)
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
              className="tooltip flipper-left"
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
              className="tooltip flipper-right"
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
