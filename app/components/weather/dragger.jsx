import React from "react";

class Dragger extends React.Component {
  constructor(props) {
    super(props);
    this.currentX = 0;
    this.currentY = 0;
  }

  componentDidUpdate() {
    this.updateOrMount();
  }

  componentDidMount() {
    this.updateOrMount();
  }

  updateOrMount() {
    if (!this.draggable) this.draggable = this.refs.draggingContainer;
    this.parent = $(this.props.parent);
  }

  onMouseDown(event) {
    const self = this;
    if (this.props.onDragStart) this.props.onDragStart(event);

    let shiftX = event.clientX - self.draggable.getBoundingClientRect().left;
    let shiftY = event.clientY - self.draggable.getBoundingClientRect().top;

    //draggable.style.position = 'absolute';
    self.draggable.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the draggable at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      let parentOffset = self.parent.offset();
      let left = pageX - shiftX - parentOffset.left;
      self.currentX = Math.min(self.parent.width(), Math.max(left));
      self.currentY = pageY - shiftY - parentOffset.top;
      self.draggable.style.left = self.currentX + "px";
      //draggable.style.top = self.currentY + 'px';
      if (self.props.onDrag) self.props.onDrag(x, y);
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the draggable on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the draggable, remove unneeded handlers
    document.onmouseup = function() {
      document.removeEventListener("mousemove", onMouseMove);
      if (self.props.onDragEnd)
        self.props.onDragEnd(self.currentX, self.currentY);
      self.draggable.onmouseup = null;
    };
  }

  render() {
    this.currentX = this.props.left || 0;
    this.currentY = this.props.top || 0;
    return (
      <div
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
        ref="draggingContainer"
      >
        {this.props.children}
      </div>
    );
  }
}
export default Dragger;
