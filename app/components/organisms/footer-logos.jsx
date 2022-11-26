import React from "react";
import { injectIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";
import SmFollow from "./sm-follow";

class FooterLogos extends React.Component {
  render() {
    const icons = config.footer.icons;
    const imgRoot = window.config.projectRoot + "images/pro/footer/";
    const imgFormat = ".png"; //window.config.webp ? ".webp" : ".png";

    return (
      <section className="section section-padding page-footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <Tooltip label={icon.title}>
                <div>
                  <a
                    href={icon.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="avoid-external-icon"
                  >
                    <img
                      alt={icon.title}
                      src={imgRoot + icon.img + imgFormat}
                    />
                  </a>
                  <div>{icon.region && <SmFollow region={icon.region} />}</div>
                </div>
              </Tooltip>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
export default injectIntl(FooterLogos);
