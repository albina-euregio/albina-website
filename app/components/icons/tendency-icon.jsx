import React from 'react';

export default class TendencyIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  get className() {
    let cl = '';

    switch(this.props.tendency) {
    case 'increasing':
      cl = 'increase';
      break;

    case 'decreasing':
      cl = 'decrease';
      break;

    default:
      break;
    }

    return cl;
  }

  render() {
    return (
      <span className={'icon-arrow-' + this.className} />
    );
  }
}
