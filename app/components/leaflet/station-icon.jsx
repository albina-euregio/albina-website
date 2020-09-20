import React from "react";
const iconSVGS = {
  forcastCircle:
    "M11 21a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm2.224-.25a.5.5 0 1 1 .225.974.5.5 0 0 1-.225-.974zm-4.537-.013l.089.013a.5.5 0 1 1-.225.974.5.5 0 0 1 .225-.974zm6.65-.726a.5.5 0 1 1 .438.899.5.5 0 0 1-.438-.9zm-9.342.23a.5.5 0 1 1 .899.438.5.5 0 0 1-.9-.438zm11.237-1.42a.5.5 0 1 1 .63.777.5.5 0 0 1-.63-.777zm-13.167.074a.5.5 0 1 1 .777.629.5.5 0 0 1-.777-.63zm14.756-1.663a.5.5 0 1 1 .777.63.5.5 0 0 1-.777-.63zm-16.345-.074a.5.5 0 1 1 .63.777.5.5 0 0 1-.63-.777zm17.535-1.821a.5.5 0 1 1 .899.438.5.5 0 0 1-.9-.438zm-18.69-.23a.5.5 0 1 1 .438.898.5.5 0 0 1-.438-.899zm19.939-2.27l.09.012a.5.5 0 1 1-.226.975.5.5 0 0 1 .225-.975zm-20.61.012a.5.5 0 1 1 .226.975.5.5 0 0 1-.225-.975zM21.5 10.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm-21 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zm20.624-2.324a.5.5 0 1 1 .225.975.5.5 0 0 1-.225-.975zM.786 8.164l.09.012a.5.5 0 1 1-.225.975.5.5 0 0 1 .225-.975zm19.455-2.17a.5.5 0 1 1 .438.9.5.5 0 0 1-.438-.9zm-19.15.231a.5.5 0 1 1 .898.438.5.5 0 0 1-.899-.438zm17.804-2.16a.5.5 0 1 1 .629.777.5.5 0 0 1-.63-.777zm-16.493.074a.5.5 0 1 1 .777.629.5.5 0 0 1-.777-.63zm14.756-1.663a.5.5 0 1 1 .777.63.5.5 0 0 1-.777-.63zm-13.02-.074a.5.5 0 1 1 .63.777.5.5 0 0 1-.63-.777zm10.968-1.081a.5.5 0 1 1 .9.438.5.5 0 0 1-.9-.438zm-8.881-.23a.5.5 0 1 1 .438.898.5.5 0 0 1-.438-.899zM13.36.263l.089.012a.5.5 0 1 1-.225.974.5.5 0 0 1 .225-.974zM8.55.276a.5.5 0 1 1 .225.974.5.5 0 0 1-.225-.974zM11 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z",
  analyseCircle:
    "M11 0c6.075 0 11 4.925 11 11s-4.925 11-11 11S0 17.075 0 11 4.925 0 11 0zm0 1C5.477 1 1 5.477 1z",
  directionArrow: "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z"
};
export default class StationIcon extends React.Component {
  RGBToHex(color) {
    let r = color[0].toString(16);
    let g = color[1].toString(16);
    let b = color[2].toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  getCircle(type, color) {
    let svgs = [];
    if (type === "forcast") {
      svgs.push(
        <svg
          style={{ position: "absolute", left: "0px", top: "0px" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={iconSVGS["analyseCircle"]}
            fill={color || "#fff"}
            stroke={color}
            fill-rule="nonzero"
          />
        </svg>
      );
      svgs.push(
        <svg
          style={{ position: "absolute", left: "0px", top: "0px" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={iconSVGS["forcastCircle"]}
            fill="#000"
            stroke="#000"
            fill-rule="nonzero"
          />
        </svg>
      );
    } else
      svgs.push(
        <svg
          style={{ position: "absolute", left: "0px", top: "0px" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={iconSVGS["analyseCircle"]}
            fill={color || "#fff"}
            stroke="#000"
            fill-rule="nonzero"
          />
        </svg>
      );

    return svgs;
  }

  getdirection(name, direction) {
    return (
      <svg
        transform={"rotate(" + direction + ")"}
        style={{ position: "absolute", left: "6.5px", top: "-11px" }}
        height="42"
        viewBox="0 0 9 42"
        width="9"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={iconSVGS[name]} fill-rule="evenodd" />
      </svg>
    );
  }

  getText(text, size) {
    return (
      <svg
        style={{ position: "absolute", left: "0px", top: "0px" }}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle">
          {text}
        </text>
      </svg>
    );
  }

  render() {
    const s = 12;

    const fill =
      typeof this.props.color === "string"
        ? this.props.color
        : "rgb(" + this.props.color + ")";

    // return(
    //   <>
    //     {iconSVGS.analyseCircle}
    //     {iconSVGS.directionArrow}
    //   </>

    // )
    console.log("StationIcon iii", this.props);
    return (
      <div
        className={
          this.props.type +
          (this.props.selected ? " " + this.props.type + "-selected" : "")
        }
      >
        {this.getCircle(this.props.dataType, this.RGBToHex(this.props.color))}
        {this.props.direction &&
          this.getdirection("directionArrow", this.props.direction)}
        {this.getText(this.props.value, s)}
      </div>
    );
  }
}
