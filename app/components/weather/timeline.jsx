import React from "react";
import $ from "jquery";
import { injectIntl } from "react-intl";

import { DATE_TIME_FORMAT, isSameDay } from "../../util/date.js";

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRedraw: new Date().getTime()
    };
    this.getClosestTick = this.getClosestTick.bind(this);
    this.getLeftForTime = this.getLeftForTime.bind(this);
    //this.redraw = this.redraw.bind(this);
  }

  componentDidMount() {
    // window.addEventListener(
    //     "resize",
    //     this.redraw
    // );
    this.onMountorUpdate();
  }

  componentDidUpdate() {
    this.onMountorUpdate();
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.redraw);
  // }

  // redraw() {
  //   this.setState({ lastRedraw: new Date().getTime() })
  // }

  onMountorUpdate() {
    //console.log("onMountorUpdate hhh", this.state);
    const thickWidth = this.tickWidth();
    if (thickWidth > 0)
      this.props.updateCB({
        tickWidth: thickWidth,
        getClosestTick: this.getClosestTick,
        getLeftForTime: this.getLeftForTime
      });
  }

  tickWidth() {
    const posFirstTick = $(".cp-scale-hour-1").first().offset();
    const posSecondTick = $(".cp-scale-hour-2").first().offset();
    if (posFirstTick === undefined || posSecondTick === undefined) return 0;
    return posSecondTick.left - posFirstTick.left;
  }

  getLeftForTime(time) {
    const theTick = $(".t" + time);
    if (theTick.offset() === undefined) return null;
    let left = Math.abs(
      theTick.offset()["left"] - $(this.refs.daysContainer).offset()["left"]
    );
    // console.log(
    //   "leftPosForCurrentTime ggg",
    //   new Date(this.props.currentTime),
    //   left
    // );
    return left;
  }

  getClosestTick(left) {
    //console.log("setClosestTick cccc", ui);

    let closestDist = 9999;
    let closestTime;
    //let nrOnlyTimespan = this.props.timeSpan.replace(/\D/g, "");

    const arrowLeft = left; // + $(".cp-scale-stamp-point-arrow").outerWidth() / 2;
    $("#whereami").css({ left: left });
    this.props.timeArray.forEach(eTime => {
      //console.log("setClosestTick eTime", eTime);
      const curItemLeft = this.getLeftForTime(eTime);
      // console.log(
      //   "setClosestTick ccc eee ITEM",
      //   eTime,
      //   arrowLeft,
      //   curItemLeft,
      //   new Date(eTime),
      //   Math.abs(arrowLeft - curItemLeft)
      // );
      if (closestDist > Math.abs(arrowLeft - curItemLeft)) {
        closestTime = eTime;
        closestDist = Math.abs(arrowLeft - curItemLeft);
        // console.log(
        //   "setClosestTick eee SET",
        //   closestDist,
        //   new Date(eTime),
        //   arrowLeft,
        //   curItemLeft
        // );
      }
    });

    if (closestTime) return closestTime;
    return null;
  }

  getTimeline() {
    let self = this;
    let lastTime;
    let days = [];
    let nrOnlyTimespan = parseInt(this.props.timeSpan.replace(/\D/g, ""), 10);

    // console.log(
    //   "getTimeline fff",
    //   self.props.timeArray.indexOf(self.props.startDate),
    //   self.props.startDate,
    //   self.props.agl
    // );
    let timeArray = this.props.timeArray.slice();

    if (nrOnlyTimespan > 1) {
      let extraTime = new Date(timeArray[0]);
      let minTime = new Date(extraTime);
      //console.log("timeArray#1", extraTime, maxTime, nrOnlyTimespan);
      minTime.setHours(minTime.getHours() - nrOnlyTimespan);

      //console.log("timeArray#2", extraTime, maxTime, nrOnlyTimespan);
      while (extraTime > minTime) {
        extraTime.setHours(extraTime.getHours() - 12);
        timeArray.unshift(extraTime.getTime());
      }
      // console.log("timeArray#3 ##55", {
      //   timeArray,
      //   extraTimeUTC: extraTime.toUTCString()
      // });
    }

    timeArray.forEach(aTime => {
      let weekday = this.props.intl.formatDate(aTime, { weekday: "long" });

      if (lastTime !== weekday) {
        let firstAvailableTime;
        let hours = [];
        for (let i = 1; i < 26; i++) {
          let currentHour = new Date(aTime).setHours(i);
          let isSelectable = self.props.timeArray.includes(currentHour);
          let spanClass = ["cp-scale-hour-" + i, "t" + currentHour];
          if (aTime < self.props.startDate) spanClass.push("cp-analyse-item");
          if (isSelectable && !firstAvailableTime)
            firstAvailableTime = currentHour;
          hours.push(
            <span
              key={currentHour}
              className={spanClass.join(" ")}
              data-timestamp={currentHour}
              data-selectable={isSelectable}
              data-time={this.props.intl.formatDate(
                currentHour,
                DATE_TIME_FORMAT
              )}
            ></span>
          );
        }

        days.push(
          <div
            className={
              self.props.currentTime &&
              isSameDay(new Date(self.props.currentTime), new Date(aTime))
                ? "cp-scale-day cp-scale-day-today"
                : "cp-scale-day "
            }
            key={aTime}
          >
            <span className="cp-scale-day-name">
              <a
                role="button"
                tabIndex="0"
                onClick={() => {
                  this.props.changeCurrentTime(firstAvailableTime);
                }}
              >
                {weekday.substring(0, 2)}
                <span>{weekday.substring(2, 20)}</span>{" "}
                {this.props.intl.formatDate(aTime, {
                  day: "numeric",
                  month: "numeric"
                })}
              </a>
            </span>
            <div key="cp-scale-hours" className="cp-scale-hours">
              {hours}
            </div>
          </div>
        );

        lastTime = weekday;
      }
    });

    return days;
  }

  render() {
    let classes = ["cp-scale-days", "redraw-" + this.state.lastRedraw];
    return (
      <div ref="daysContainer" key="days" className={classes.join(" ")}>
        {this.getTimeline()}
      </div>
    );
  }
}
export default injectIntl(Timeline);
