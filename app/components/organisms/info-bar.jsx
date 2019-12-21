import React from "react";

export default class InfoBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentLevel: "" };
    this.delayedLevel = "";
    this.levels = props.levels || {
      "": { message: "Loading", iconOn: true },
      loading: { message: "Loading", delay: 1000, iconOn: true },
      error: { message: "Error" },
      "ok:": { message: "finished", keep: true }
    };
  }

  getI(def, para) {
    // console.log("InfoBar->getI", typeof def, def, para);
    if (typeof def === "string") return def;
    if (typeof def === "object") return def[para];
    return undefined;
  }

  resetInterval() {
    // console.log("InfoBar->resetInterval", this.messageIntervall);
    if (this.messageIntervall) {
      clearTimeout(this.messageIntervall);
      this.messageIntervall = undefined;
    }
  }

  setInfoMessage() {
    // console.log("InfoBar->setInfoMessage", "state: " + this.state.currentLevel, "props: " + this.props.level, this.levels[this.props.level]);//, this.getI(this.levels[this.props.level], "iconOn"))
    const self = this;
    const newLevel = this.props.level;
    const newLevelData = this.levels[newLevel];
    let nDelay;
    if (!newLevelData) return;

    if (newLevel != this.state.currentLevel) {
      if ((nDelay = this.getI(newLevelData, "delay"))) {
        // console.log("InfoBar->setInfoMessage #1" , newLevel, this.delayedLevel);
        if (newLevel != this.delayedLevel) {
          // console.log("InfoBar->setInfoMessage #2" , nDelay);
          this.resetInterval();
          this.messageIntervall = setTimeout(() => {
            self.messageIntervall = undefined;
            // console.log("InfoBar->TIMEOUT", newLevel,  self.state.currentLevel);
            if (newLevel != self.state.currentLevel) {
              self.setState({ currentLevel: newLevel });
              self.delayedLevel = "";
            }
          }, nDelay);
          this.setLoadingIndicator(this.getI(newLevelData, "iconOn") || false);
          this.delayedLevel = newLevel;
        }
      } else {
        if (newLevel != this.state.currentLevel) {
          this.resetInterval();
          this.delayedLevel = "";
          if (!this.getI(newLevelData, "keep"))
            self.setState({ currentLevel: newLevel });
          self.setLoadingIndicator(this.getI(newLevelData, "iconOn") || false);
        }
      }
    }
  }

  setLoadingIndicator(on) {
    //show hide loading image
    // console.log("InfoBar->setLoadingIndicator", on)
    if (on) {
      $("html").addClass("page-loading");
      $("html").removeClass("page-loaded");
    } else {
      $("html").removeClass("page-loading");
      setTimeout(() => {
        $("html").addClass("page-loaded");
      }, 1000);
    }
  }

  componentDidUpdate() {
    this.setInfoMessage();
  }

  componentDidMount() {
    this.setInfoMessage();
  }

  render() {
    // console.log("InfoBar->render", this.getI(this.levels[this.state.currentLevel], "message"));
    const infoMessage = this.getI(
      this.levels[this.state.currentLevel],
      "message"
    );
    if (infoMessage)
      return (
        <section className="section controlbar fade-in">
          <div className="section-centered">
            <p className="align-center">{infoMessage}</p>
          </div>
        </section>
      );
    return [];
  }
}
