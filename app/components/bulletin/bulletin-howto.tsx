import React from "react";
import { observer } from "mobx-react";
import { FormattedMessage } from "react-intl";

function BulletinHowTo() {
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

export default observer(BulletinHowTo);
