import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";

class BulletinHowTo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section className="section-centered">
        <div className="panel field">
          <span>
            <FormattedMessage
              id="bulletin:howto"
              values={{ strong: (...msg) => <strong>{msg}</strong> }}
            />
          </span>
        </div>
      </section>
    );
  }
}

export default injectIntl(observer(BulletinHowTo));
