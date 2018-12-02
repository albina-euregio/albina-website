import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class FooterLogos extends React.Component {
  render() {
    const icons = [
      { img: "ORIZZONTALE" },
      { img: "Landeslogo_Regular_4c" },
      { img: "LW-4Z-3sprachig" },
      { img: "Stemma_PAT_colore" }
    ];

    return (
      <section className="section section-padding footer-images">
        <ul className="list-inline">
          {icons.map((icon, i) => (
            <li key={i}>
              <img src={"../../images/pro/footer/" + icon.img + ".png"} />
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(FooterLogos));
