import React from "react";

{
  /* USAGE **
  
  <ControlBar 
    backgroundImage="http://placeimg.com/1000/1000/tech" // optional
    style="yellow" // optional: default / light / yellow
    addClass="fade-in" // optional
    isBig={false} // optional
    caption="Hey, I am here" // optional
    subCaption="This is my subcaption" // optional
    message={<span>This is a <strong>Controlbar</strong> with a <a href="#">link</a></span>} 
    buttonLink="#" // optional
    buttonCaption="Button" // optional
    buttonsTitle="Buttonstitle" // optional
  /> 
*/
}

type Props = {
  backgroundImage?: string;
  isBig?: boolean;
  style?: "light" | "yellow";
  addClass?: string;
  message: React.ReactNode;
  subCaption?: React.ReactNode;
  buttonLink?: string;
  buttonTitle?: string;
  buttonCaption?: string;
};

export default function ControlBar(props: Props) {
  const styleClasses = {
    light: "controlbar-subtle",
    yellow: "controlbar-dev"
  };

  const sectionClasses = ["section", "controlbar"];
  if (props.backgroundImage) sectionClasses.push("controlbar-image");
  if (props.isBig) sectionClasses.push("controlbar-big");
  if (props.style && styleClasses[props.style])
    sectionClasses.push(styleClasses[props.style]);
  if (props.addClass) sectionClasses.push(props.addClass);

  return (
    <section id="" className={sectionClasses.join(" ")}>
      {props.backgroundImage && (
        <div
          className="controlbar-bg-image"
          style={{ backgroundImage: "url(" + props.backgroundImage + ")" }}
        ></div>
      )}

      {/* <!-- default, not for controlbar-big --> */}
      {!props.isBig && <div className="section-centered">{props.message}</div>}

      {/* <!-- for controlbar-big --> */}
      {props.isBig && (
        <div className="section-centered-small controlbar-big">
          <section className="section-header">
            {props.subCaption && (
              <h2 className="subheader align-center">{props.subCaption}</h2>
            )}
            {props.subCaption && (
              <h1 className="align-center">{props.subCaption}</h1>
            )}
          </section>

          <p className="align-center">{props.message}</p>
          {props.buttonLink && (
            <p className="align-center">
              <a
                href={props.buttonLink}
                title={props.buttonTitle || props.buttonCaption}
                className="secondary pure-button"
              >
                {props.buttonCaption || "Link"}
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
