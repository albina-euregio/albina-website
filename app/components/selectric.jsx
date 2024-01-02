import React from "react";

/**
 * Component to be used for selectric select boxes.
 * Implementation is inspired by
 * https://reactjs.org/docs/integrating-with-other-libraries.html#integrating-with-jquery-chosen-plugin
 */
class Selectric extends React.Component {
  render() {
    return (
      <select
        className="dropdown selectric"
        onChange={e => this.props.onChange(e.target.value)}
        value={this.props.value}
        disabled={this.props.disabled}
        title={this.props.title}
      >
        {this.props.children}
      </select>
    );
  }
}

export default Selectric;
