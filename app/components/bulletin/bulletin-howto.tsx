import React from "react";
import { FormattedMessage } from "../../i18n";

function BulletinHowTo() {
  return (
    <section className="section-centered">
      <div className="panel field">
        <span>
          <FormattedMessage
            id="bulletin:howto"
            html={true}
            values={{ strong: (...msg) => <strong>{msg}</strong> }}
          />
        </span>
      </div>
    </section>
  );
}

export default BulletinHowTo;
