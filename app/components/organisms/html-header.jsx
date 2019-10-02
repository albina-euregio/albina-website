import React from "react";
import MetaTags from "react-meta-tags";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class HTMLHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const breadcrumbs = [
      this.props.title,
      this.props.intl.formatMessage({ id: "app:title" })
    ];

    const description = this.props.description
      ? this.props.description
      : this.props.title;
    const title = breadcrumbs.join(" | ");

    const defaultMeta = {
      "og:description": description,
      "og:title": title
    };
    const meta = Object.assign({}, defaultMeta, this.props.meta);

    return (
      <div>
        <MetaTags>
          <title>{title}</title>
          <meta name="description" content={description} />
          {Object.keys(meta).map(key => (
            <meta key={key} property={key} content={meta[key]} />
          ))}
        </MetaTags>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(HTMLHeader));
