import React from "react";
import { observer } from "mobx-react";

@observer
export default class WeatherMapTitle extends React.Component {
  render() {
    return (
      <div>
        <h2 className="subheader">
          {this.props.store.itemId &&
            this.props.store.item.descriptionDate[window["appStore"].language]}
        </h2>
        <h2>
          {this.props.store.domainId
            ? this.props.store.item.description[window["appStore"].language]
            : ""}
        </h2>
      </div>
    );
  }
}
