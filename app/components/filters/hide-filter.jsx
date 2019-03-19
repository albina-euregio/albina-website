import React from 'react';

export default class HideFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const classes = [
      "label",
      "tooltip"
    ];
    if(this.props.active) {
      classes.push('js-active');
    }

    return (
      <a className={classes.join(' ')}
        href="#"
        title={this.props.tooltip}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.props.onToggle(this.props.id);
        }}
        >{this.props.title}</a>
    )
  }
}
