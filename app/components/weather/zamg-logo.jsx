import React from "react";
import Control from "react-leaflet-control";

export default class ZamgLogo extends React.Component {
  render() {
    return (
      <Control position="bottomright">
        <a href="https://www.zamg.ac.at" className="pure-button secondary" target="_blank"><div id="zamg-logo"></div></a>
      </Control>
    );
  }
}
