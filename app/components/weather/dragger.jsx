import React from "react";
import $ from "jquery";

class Dragger extends React.Component {
  constructor(props) {
    super(props);
    this.currentX = 0;
    this.currentY = 0;
    this.forcePositionTo = this.forcePositionTo.bind(this);
  }

  componentDidUpdate() {
    this.updateOrMount();
  }

  componentDidMount() {
    this.updateOrMount();
    if (this.props.rePosition) this.props.rePosition(this.forcePositionTo);
  }

  updateOrMount() {
    if (!this.draggable) this.draggable = this.refs.draggingContainer;
    this.parent = $(this.props.parent);
  }

  onDragStart(event, getXInit, getYInit, getXOnMove, getYOnMove) {
    event.stopPropagation();
    //console.log("onTouchStart", event);
    const self = this;
    if (this.props.onDragStart) this.props.onDragStart(event);

    let shiftX = getXInit(event) - self.draggable.getBoundingClientRect().left;
    let shiftY = getYInit(event) - self.draggable.getBoundingClientRect().top;

    self.draggable.style.zIndex = 1000;

    moveAt(getXOnMove(event), getYOnMove(event));

    // moves the draggable at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      //console.log("moveAt" ,pageX, pageY, shiftX, shiftY);
      let parentOffset = self.parent.offset();
      let left = pageX - shiftX - parentOffset.left;
      self.currentX = Math.min(self.parent.width(), Math.max(left));
      self.currentY = pageY - shiftY - parentOffset.top;
      self.draggable.style.left = self.currentX + "px";
      //draggable.style.top = self.currentY + 'px';
      if (self.props.onDrag) self.props.onDrag(self.currentX, self.currentY);
    }

    function onMouseMove(event) {
      //console.log("onMouseMove", event);
      moveAt(getXOnMove(event), getYOnMove(event));
    }

    // move the draggable on mousemove
    document.addEventListener("touchmove", onMouseMove);
    document.addEventListener("mousemove", onMouseMove);

    // drop the draggable, remove unneeded handlers
    function unregister(event) {
      event.stopPropagation();
      document.removeEventListener("touchmove", onMouseMove);
      document.removeEventListener("mousemove", onMouseMove);
      if (self.props.onDragEnd)
        self.props.onDragEnd(self.currentX, self.currentY);
      document.removeEventListener("mouseup", unregister);
      document.removeEventListener("touchend", unregister);
    }
    document.addEventListener("mouseup", unregister);
    document.addEventListener("touchend", unregister);
  }

  onTouchStart(event) {
    this.onDragStart(
      event,
      event => event.changedTouches[0].clientX,
      event => event.changedTouches[0].clientY,
      event => event.changedTouches[0].clientX,
      event => event.changedTouches[0].clientY
    );
  }

  onMouseDown(event) {
    this.onDragStart(
      event,
      event => event.clientX,
      event => event.clientY,
      event => event.pageX,
      event => event.pageY
    );
  }

  forcePositionTo(x, y) {
    //console.log("dragger->forcePositionTo gggg", x, y, this.draggable);
    this.currentX = x;
    this.currentY = y;
    this.draggable.style.left = this.currentX + "px";
    //this.draggable.style.top = this.currentY + "px";
  }

  render() {
    //console.log("dragger->render hhh", this.currentX);
    this.currentX = this.props.left || 0;
    this.currentY = this.props.top || 0;
    return (
      <div
        role="button"
        tabIndex="0"
        style={{
          display: "block",
          position: "absolute",
          left: this.currentX || 0
        }}
        onDragStart={() => {
          return false;
        }}
        className={this.props.classes ? this.props.classes.join(" ") : ""}
        onMouseDown={this.onMouseDown.bind(this)}
        onTouchStart={this.onTouchStart.bind(this)}
        ref="draggingContainer"
      >
        {this.props.children}
      </div>
    );
  }
}
export default Dragger;
