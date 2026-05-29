import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import SmFollow from "./sm-follow";

export default function FooterLogos() {
  const icons = config.footer.icons;
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
                src={`${window.config.projectRoot}images/pro/footer/${icon.img}`}
              />
            </a>
          </Tooltip>
          {icon.region && <SmFollow region={icon.region} />}
        </div>
      ))}
    </section>
  );
}
