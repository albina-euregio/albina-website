import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class FooterLogos extends React.Component {
  render() {
    const icons = config.get("footer.icons");

    return (
      <section className="section section-padding footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <a href={icon.url} target="_blank">
                <img
                  title={icon.title}
                  src={"../../images/pro/footer/" + icon.img + ".png"}
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(FooterLogos));
