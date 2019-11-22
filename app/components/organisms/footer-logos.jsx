import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

class FooterLogos extends React.Component {
  render() {
    const icons = config.get("footer.icons");
    const imgRoot = window["config"].get("projectRoot") + "images/pro/footer/";
    const imgFormat = window["config"].get("webp") ? ".webp" : ".png";

    return (
      <section className="section section-padding footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <a href={icon.url} target="_blank" className="logo tooltip">
                <img
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
