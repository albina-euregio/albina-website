import React from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { APP_STORE } from "../../appStore";
import { getWarnlevelNumber } from "../../util/warn-levels";
import { Tooltip } from "../../components/tooltips/tooltip";

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

    const link = "/education/danger-scale?lang=" + APP_STORE.language;

    const below =
      this.props.elevation || this.props.treeline
        ? this.props.below
        : this.props.above;

    const numberBelow = getWarnlevelNumber(below);
    const numberAbove = getWarnlevelNumber(this.props.above);

    const imgFormat = window.config.webp ? ".webp" : ".png";
    const img =
      this.imgRoot + "levels_" + numberBelow + "_" + numberAbove + imgFormat;

    let title;
    let elevationText;
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
      ].join("\n");
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
      ].join("\n");
      elevationText = this.props.elevation + "m";
    }

    return (
      <Tooltip label={title}>
        <Link to={link} tabIndex="-1">
          <img src={img} alt={title} />
          {this.props.above != this.props.below && <span>{elevationText}</span>}
        </Link>
      </Tooltip>
    );
  }
}
export default injectIntl(WarnLevelIcon);
