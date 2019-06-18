import React from "react";
import { ReactTitle } from "react-meta-tags";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class HTMLHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const breadcrumbs = [
      this.props.title,
      this.props.intl.formatMessage({id: 'app:title'})
    ];

    return (
      <div>
        <ReactTitle title={breadcrumbs.join(" | ")} />
      </div>
    )
  }
}

export default inject("locale")(injectIntl(HTMLHeader));
