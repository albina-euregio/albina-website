import React from 'react';

/**
 * Component to be used for selectric select boxes.
 * Implementation is inspired by
 * https://reactjs.org/docs/integrating-with-other-libraries.html#integrating-with-jquery-chosen-plugin
 */
export default class Selectric extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    const update = () => {
      if(this.props.className) {
        this.$el.closest('.selectric-wrapper').addClass(this.props.className);        
      }
    };

    this.$el.selectric({
      onChange: this.handleChange,
      onInit: () => { update(); },
      onRefresh: () => { update(); }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.selectric('refresh');
    }
  }

  handleChange = (e) => {
    // imported code from custom.js
    this.$el.closest(".selectric-wrapper").addClass("selectric-changed");
    this.props.onChange(this.$el.val());
  };

  render() {
    return (
      <select
        className="dropdown"
        ref={(el) => { this.el = el; }}
        value={this.props.value} >
        {this.props.children}
      </select>
    );
  }
}
