import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class FooterLogos extends React.Component {
  render() {
    const icons = config.footer.icons;
    const imgRoot = window.config.projectRoot + "images/pro/footer/";
    const imgFormat = window.config.webp ? ".webp" : ".png";

    return (
      <section className="section section-padding page-footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <a
                href={icon.url}
                target="_blank"
                className="avoid-external-icon tooltip"
              >
                <img
                  alt={icon.title}
                  title={icon.title}
                  className="tooltip"
                  src={imgRoot + icon.img + imgFormat}
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
