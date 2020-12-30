import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { getWarnlevelNumber } from "../../util/warn-levels";

class WarnLevelIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);

    this.imgRoot = window.config.projectRoot + "images/pro/warning-pictos/";
  }

  render() {
    const getWarnlevelText = warnLevel => {
      if (warnLevel) {
        const number = getWarnlevelNumber(warnLevel);
        return (
          (number ? number + "–" : "") +
          this.props.intl.formatMessage({
            id: "danger-level:" + warnLevel
          })
        );
      }
      return "";
    };

    const link = "/education/danger-scale?lang=" + window["appStore"].language;

    const below =
      this.props.elevation || this.props.treeline
        ? this.props.below
        : this.props.above;

    const numberBelow = getWarnlevelNumber(below);
    const numberAbove = getWarnlevelNumber(this.props.above);

    const imgFormat = window.config.webp ? ".webp" : ".png";
    const img =
      this.imgRoot + "levels_" + numberBelow + "_" + numberAbove + imgFormat;

    var title;
    var elevationText;
    if (below == this.props.above) {
      title = this.props.intl.formatMessage(
        { id: "bulletin:report:dangerlevel" },
        { level: getWarnlevelText(this.props.above) }
      );
      elevationText = "";
    } else if (this.props.treeline) {
      title = [
        this.props.intl.formatMessage(
          { id: "bulletin:report:dangerlevel-treeline-above" },
          { level: getWarnlevelText(this.props.above) }
        ),
        this.props.intl.formatMessage(
          { id: "bulletin:report:dangerlevel-treeline-below" },
          { level: getWarnlevelText(this.props.below) }
        )
      ].join("<br />");
      elevationText = this.props.intl.formatMessage({
        id: "bulletin:treeline"
      });
    } else {
      title = [
        this.props.intl.formatMessage(
          { id: "bulletin:report:dangerlevel-above" },
          {
            elev: this.props.elevation,
            level: getWarnlevelText(this.props.above)
          }
        ),
        this.props.intl.formatMessage(
          { id: "bulletin:report:dangerlevel-below" },
          {
            elev: this.props.elevation,
            level: getWarnlevelText(this.props.below)
          }
        )
      ].join("<br />");
      elevationText = this.props.elevation + "m";
    }

    return (
      <Link to={link} title={title} className="tooltip">
        <img src={img} alt={title} />
        {this.props.above != this.props.below && <span>{elevationText}</span>}
      </Link>
    );
  }
}
export default inject("locale")(injectIntl(WarnLevelIcon));
