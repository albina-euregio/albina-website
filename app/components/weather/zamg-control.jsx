import React from "react";
import Control from "react-leaflet-control";

export default class ZamgControl extends React.Component {
  render() {
    return (
      <Control position="bottomright" className="zamg-logo-container">
        <a
          href="https://www.zamg.ac.at"
          className="pure-button secondary"
          target="_blank"
        >
          <div id="zamg-logo"></div>
        </a>
      </Control>
    );
  }
}
