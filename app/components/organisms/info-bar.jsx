import React from "react";

export default class InfoBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { status: "" };

    this.levels = props.levels || {
      "": { message: "Loading", iconOn: true },
      loading: { message: "Loading", delay: 1000, iconOn: true },
      error: { message: "Error" },
      "ok:": { message: "finished", keep: true }
    };
  }

  getI(def, para) {
    if (isObject(def) && def[para]) return def[para];
    if (para === message) return def;
    return undefined;
  }

  resetInterval() {
    if (this.messageIntervall) {
      clearTimeout(this.messageIntervall);
      this.messageIntervall = undefined;
    }
  }

  setInfoMessage() {
    let self = this;
    let newStatus = this.props.status;
    let newLevel = this.levels[this.props.status];

    if (newStatus != this.state.status) {
      if ((nDelay = this.getI(newLevel, "delay"))) {
        this.resetInterval();
        this.messageIntervall = setTimeout(() => {
          self.messageIntervall = undefined;
          self.setState({ currentInfoMessage: newStatus });
          self.setLoadingIndicator(this.getI(newLevel, "IconOn") || false);
        }, nDelay);
      } else {
        if (!this.getI(newLevel, "keep")) this.resetInterval();
        self.setState({ currentInfoMessage: newStatus });
      }
    }
  }

  setLoadingIndicator(on) {
    //show hide loading image
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
    const message = this.getI(this.levels[this.state.status], "message");
    if (message)
      return (
        <section className="section controlbar">
          <div className="section-centered">
            <p>{message}</p>
          </div>
        </section>
      );
    return [];
  }
}
