import React from "react";
import { injectIntl } from "react-intl";

class VideoDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal-container">
        <div className="modal-subscribe">
          <div
            className="fluidvids"
            style={{
              position: "relative",
              paddingBottom: "56.25%" /* 16:9 */,
              paddingTop: 25,
              height: 0
            }}
          >
            <iframe
              title={this.props.intl.formatMessage({
                id: "app:title"
              })}
              src="https://www.youtube.com/embed/uzY5uj_VIEs"
              webkitallowfullscreen=""
              mozallowfullscreen=""
              allowFullScreen={true}
              className="fluidvids-item"
              data-fluidvids="loaded"
              width="100%"
              frameBorder="0"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
}
export default injectIntl(VideoDialog);
