import React from 'react';

export default class TendencyIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span className={'icon-arrow-' + this.props.tendency} />
    );
  }
}
