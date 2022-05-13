import React from "react";
import { injectIntl } from "react-intl";
import { Tooltip } from "./tooltips/tooltip";

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ text: this.props.value });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.value !== "undefined" &&
      this.props.value != prevProps.value &&
      this.props.value != this.state.text
    ) {
      this.setState({ text: this.props.value });
    }
  }

  render() {
    const placeholder = this.props.intl.formatMessage({ id: "filter:search" });
    return (
      <div>
        <p className="info">{this.props.title}</p>
        <div className="pure-form pure-form-search">
          <input
            type="text"
            id="input"
            placeholder={placeholder}
            onChange={e => {
              const newVal = e.target.value;
              if (newVal != this.state.text) {
                window.setTimeout(() => {
                  this.setState({ text: newVal });
                }, 0);
              }
            }}
            onKeyPress={e => {
              if (e.key == "Enter") {
                this.props.handleSearch(this.state.text);
              }
            }}
            value={this.state.text}
          />
          <Tooltip label={placeholder}>
            <button
              href="#"
              aria-label={placeholder}
              className="pure-button pure-button-icon icon-search"
              onClick={() => {
                this.props.handleSearch(this.state.text);
              }}
            >
              <span>&nbsp;</span>
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
export default injectIntl(SearchField);
