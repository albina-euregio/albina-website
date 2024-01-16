import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";

const Dragger = ({
  parent,
  onDrag,
  onDragEnd,
  coordinates,
  classes,
  children
}) => {
  const [currentX, setCurrentX] = useState(-1);
  const [currentY, setCurrentY] = useState(-1);
  const [dragging, setDragging] = useState(null);

  const draggableRef = useRef(null);

  useEffect(() => {
    //console.log("Dragger->useEffect s01 x : ", {dragging, coordinates, ref: draggableRef.createElement});
    if (!dragging && coordinates.x && draggableRef.current)
      setCurrentX(coordinates.x);
  }, [coordinates]);

  useEffect(() => {
    //console.log("Dragger->useEffect-> s04", { currentX, dragging });
    if (!dragging && dragging != null) {
      if (onDragEnd) onDragEnd(currentX, currentY);
    }
  }, [dragging]);

  const onDragStart = (event, getXInit, getYInit, getXOnMove, getYOnMove) => {
    event.stopPropagation();
    //console.log("onTouchStart", event);

    setDragging(true);
    const parent$ = $(parent);
    if (onDrag) onDrag(event);

    let shiftX =
      getXInit(event) - draggableRef.current.getBoundingClientRect().left;
    let shiftY =
      getYInit(event) - draggableRef.current.getBoundingClientRect().top;

    draggableRef.current.style.zIndex = 1000;

    moveAt(getXOnMove(event), getYOnMove(event));

    // moves the draggable at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      let parentOffset = parent$.offset();
      let left = pageX - shiftX - parentOffset.left;
      setCurrentX(Math.min(parent$.width(), Math.max(left)));
      setCurrentY(pageY - shiftY - parentOffset.top);
      //console.log("moveAt s02" , {currentX, currentY});
      if (onDrag) onDrag();
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
      document.removeEventListener("mouseup", unregister);
      document.removeEventListener("touchend", unregister);
      setDragging(false);
    }
    document.addEventListener("mouseup", unregister);
    document.addEventListener("touchend", unregister);
  };

  const onTouchStart = event => {
    onDragStart(
      event,
      event => event.changedTouches[0].clientX,
      event => event.changedTouches[0].clientY,
      event => event.changedTouches[0].clientX,
      event => event.changedTouches[0].clientY
    );
  };

  const onMouseDown = event => {
    onDragStart(
      event,
      event => event.clientX,
      event => event.clientY,
      event => event.pageX,
      event => event.pageY
    );
  };

  return (
    <div
      role="button"
      tabIndex="0"
      style={{
        display: "block",
        position: "absolute",
        left: currentX || 0
      }}
      className={classes ? classes.join(" ") : ""}
      onMouseDown={event => onMouseDown(event, currentX, currentY)}
      onTouchStart={event => onTouchStart(event, currentX, currentY)}
      ref={draggableRef}
    >
      {children}
    </div>
  );
};
export default Dragger;
