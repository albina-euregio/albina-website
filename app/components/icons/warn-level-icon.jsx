import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";

class WarnLevelIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);

    // http://localhost/projects/albina-cms/web/de/api/taxonomy_term/warning_levels?sort=level&fields[taxonomy_term--warning_levels]=name,level
    // FIXME: should go to config.ini
    this.imgRoot =
      window["config"].get("projectRoot") + "images/pro/warning-pictos/";
  }

  render() {
    const getWarnlevelText = warnLevel => {
      if (warnLevel) {
        return this.props.intl.formatMessage({
          id: "danger-level:" + warnLevel
        });
      }
      return "";
    };

    const link = "/education/dangerscale?lang=" + window["appStore"].language;

    const below =
      this.props.elevation || this.props.treeline
        ? this.props.below
        : this.props.above;

    const b = window["appStore"].getWarnlevelNumber(below);
    const a = window["appStore"].getWarnlevelNumber(this.props.above);

    const elevText = this.props.elevation
      ? this.props.elevation + "m"
      : this.props.treeline
      ? this.props.intl.formatMessage({ id: "bulletin:treeline" })
      : a == 0
      ? this.props.intl.formatMessage({
          id: "danger-level:" + this.props.above
        })
      : "";

    const imgFormat = window["config"].get("webp") ? ".webp" : ".png";
    const img = this.imgRoot + "levels_" + b + "_" + a + imgFormat;

    var title, alt;
    if (below == this.props.above) {
      const params = {
        number: a == 0 ? "" : a,
        text: getWarnlevelText(this.props.above)
      };
      title = params.number
        ? this.props.intl.formatMessage(
            { id: "bulletin:map:info:danger-picto:hover" },
            params
          )
        : params.text;
      alt = this.props.intl.formatMessage(
        { id: "bulletin:map:info:danger-picto:alt" },
        params
      );
    } else {
      const params = {
        elev: elevText,
        "number-below": b == 0 ? "" : b,
        "number-above": a == 0 ? "" : a,
        "text-below": getWarnlevelText(below),
        "text-above": getWarnlevelText(this.props.above)
      };
      title = params["number-below"]
        ? this.props.intl.formatMessage(
            { id: "bulletin:map:info:danger-picto2:hover" },
            params
          )
        : this.props.intl.formatMessage(
            { id: "bulletin:map:info:danger-picto2-no-value-below:hover" },
            params
          );
      alt = this.props.intl.formatMessage(
        { id: "bulletin:map:info:danger-picto2:alt" },
        params
      );
    }

    return (
      <Link to={link} title={title} className="tooltip">
        <img src={img} alt={alt} />
        {this.props.above != this.props.below && <span>{elevText}</span>}
      </Link>
    );
  }
}
export default inject("locale")(injectIntl(WarnLevelIcon));
