import React from "react";

export default class HideGroupFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        {Array.isArray(this.props.children) && (
          <ul className="list-inline filter">
            {this.props.children.map((f, i) => f && <li key={i}>{f}</li>)}
          </ul>
        )}
      </div>
    );
  }
}
