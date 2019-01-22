import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class FooterLogos extends React.Component {
  render() {
    const icons = config.get("footer.icons");
    const imgRoot = window["config"].get("projectRoot") + "images/pro/footer/";

    return (
      <section className="section section-padding footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <a href={icon.url} target="_blank" className="logo">
                <img title={icon.title} src={imgRoot + icon.img + ".png"} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(FooterLogos));
