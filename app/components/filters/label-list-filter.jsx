import React from 'react';

export default class LabelListFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <span className="info">{this.props.title}</span>
        <ul className="list-inline filter">
          {
            Object.keys(this.props.labels).map((k) => <li key={k}>
              <a className="label tooltip js-active" href="#" title={this.props.labels[k]}>{this.props.labels[k]}</a>
            </li>)
          }
        </ul>
      </div>
    );
  }
}
