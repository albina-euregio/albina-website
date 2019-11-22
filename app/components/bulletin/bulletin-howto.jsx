import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class BulletinHowTo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section className="section-centered">
        <div className="panel field">
          <FormattedHTMLMessage id="bulletin:howto" />
        </div>
      </section>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinHowTo)));
