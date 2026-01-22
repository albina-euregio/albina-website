import React from "react";

export default function LinktreeFeature(props) {
  //console.log("LinktreeFeature->render xx101", props);
  const getContent = () => {
    return (
      <>
        <div className="content-image">
          {props.image.url && (
            <img
              src={props.image.url}
              title={props.image.title || ""}
              alt={props.image.alt || ""}
              onError={props.image.onError}
            />
          )}
        </div>

        <div className="content-text">
          <h1 className="subheader linkbox-feature-title">{props.title}</h1>
        </div>
      </>
    );
  };
  return (
    <>
      {!props.external && (
        <a href={props.url} className="linkbox linkbox-linktree-feature">
          {getContent()}
        </a>
      )}
      {props.external && (
        <a href={props.url} className="linkbox linkbox-linktree-feature">
          {getContent()}
        </a>
      )}
    </>
  );
}
