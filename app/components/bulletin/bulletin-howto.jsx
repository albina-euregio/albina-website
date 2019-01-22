import React from "react";
import { observer, inject } from "mobx-react";
import { computed } from "mobx";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { dateToDateString, dateToTimeString } from "../../util/date.js";

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
