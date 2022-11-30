import React from "react";
import { injectIntl } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

class FooterLogos extends React.Component {
  render() {
    const icons = config.footer.icons;
    const imgRoot = window.config.projectRoot + "images/pro/footer/";
    const imgFormat = ".png"; //window.config.webp ? ".webp" : ".png";

    return (
      <section className="section section-padding page-footer-logos">
        {icons.map((icon, i) => (
          <div className="footer-logo" key={i}>
            <Tooltip label={icon.title}>
              <a
                href={icon.url}
                rel="noopener noreferrer"
                target="_blank"
                className="footer-logo-link avoid-external-icon"
              >
                <img
                  className="footer-logo-img"
                  alt={icon.title}
                  src={imgRoot + icon.img + imgFormat}
                />
              </a>
            </Tooltip>
            <div className="footer-logo-share-follow">
              <p>
                <strong>Follow Tirol</strong> on Social Media
              </p>
              <ul class="list-inline sm-buttons">
                <li>
                  <a
                    href="#"
                    class="sm-button icon-sm-facebook"
                    aria-label="Follow Tirol on Facebook"
                  >
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="sm-button icon-sm-instagram"
                    aria-label="Follow Tirol on Instagram"
                  >
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="sm-button icon-sm-youtube"
                    aria-label="Follow Tirol on YouTube"
                  >
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </section>
    );
  }
}
export default injectIntl(FooterLogos);
