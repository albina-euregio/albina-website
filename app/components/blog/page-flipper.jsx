import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";

class BlogPageFlipper extends React.Component {
  constructor(props) {
    super(props);
  }

  isNextPage() {
    return this.store.page < this.store.maxPages;
  }

  isPreviousPage() {
    return this.store.page != 1;
  }

  render() {
    this.store = this.props.store;
    const pageTranslation = this.props.intl.formatMessage({
      id: "blog:page-flipper:page"
    });
    return (
      <ul className="list-inline bulletin-flipper">
        {this.isPreviousPage() && (
          <li className="bulletin-flipper-back">
            <a
              onClick={() => this.props.handlePreviousPage()}
              title={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:back"
              })}
              className="tooltip"
            >
              <span className="icon-arrow-left"></span>
              {pageTranslation} {this.store.page - 1}
            </a>
          </li>
        )}

        <li className="bulletin-flipper-separator">
          {this.store.page}/{this.store.maxPages}
        </li>
        {this.isNextPage() && (
          <li className="bulletin-flipper-forward">
            <a
              onClick={() => this.props.handleNextPage()}
              title={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:forward"
              })}
              className="tooltip"
            >
              {pageTranslation} {this.store.page + 1}{" "}
              <span className="icon-arrow-right" />
            </a>
          </li>
        )}
      </ul>
    );
  }
}

export default injectIntl(observer(BlogPageFlipper));
