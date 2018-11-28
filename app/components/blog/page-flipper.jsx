import React from "react";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { computed } from "mobx";
import { injectIntl } from "react-intl";

@observer
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
      <ul className="list-inline blog-page-flipper">
        {this.isPreviousPage() && (
          <li className="page-flipper-back">
            <a
              onClick={() => this.props.handlePreviousPage()}
              title={this.props.intl.formatMessage({
                id: "bulletin:header:dateflipper:back"
              })}
              className="tooltip"
            >
              <span className="icon-arrow-left" />
              <span className="">
                {pageTranslation} {this.store.page - 1}
              </span>
            </a>
          </li>
        )}

        <li className="page-flipper-separator">
          {this.store.page} / {this.store.maxPages}
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
              <span className="">
                {pageTranslation} {this.store.page + 1}
              </span>
              <span className="icon-arrow-right" />
            </a>
          </li>
        )}
      </ul>
    );
  }
}

export default inject("locale")(injectIntl(observer(BlogPageFlipper)));
