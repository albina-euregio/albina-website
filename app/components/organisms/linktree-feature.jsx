import React from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";

class LinktreeFeature extends React.Component {
  render() {
    const props = this.props;

    const getContent = () => {
      return (
        <>
          <div className="content-image">
            {props.image.url && (
              <img
                src={props.image.url}
                title={props.image.title || ""}
                alt={props.image.alt || ""}
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
          <Link to={props.url} className="linkbox linkbox-linktree-feature">
            {getContent()}
          </Link>
        )}
        {props.external && (
          <a href={props.url} className="linkbox linkbox-linktree-feature">
            {getContent()}
          </a>
        )}
      </>
    );
  }
}
export default injectIntl(LinktreeFeature);
