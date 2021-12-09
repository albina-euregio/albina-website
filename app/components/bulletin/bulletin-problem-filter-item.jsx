import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import ProblemIcon from "../icons/problem-icon.jsx";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

class BulletinProblemFilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      id: this.props.problemId
    };
  }

  toggle(e) {
    e.preventDefault();

    this.props.handleSelectRegion();

    if (this.state.active) {
      BULLETIN_STORE.dimProblem(this.state.id);
    } else {
      BULLETIN_STORE.highlightProblem(this.state.id);
    }
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const problemText = this.props.intl.formatMessage({
      id: "problem:" + this.props.problemId
    });

    const title = this.props.intl.formatMessage(
      {
        id: this.props.active
          ? "bulletin:legend:dehighlight:hover"
          : "bulletin:legend:highlight:hover"
      },
      { problem: problemText }
    );
    const classes =
      "img tooltip" + (this.props.active ? "" : " js-deactivated");

    return (
      <li>
        <a
          href="#"
          title={title}
          className={classes}
          onClick={e => this.toggle(e)}
        >
          <ProblemIcon
            problem={this.props.problemId}
            active
            alt={problemText}
          />
          {/* <ProblemIcon
            problem={this.props.problemId}
            active={false}
            alt={problemText}
          /> */}
        </a>
      </li>
    );
  }
}

export default injectIntl(observer(BulletinProblemFilterItem));
