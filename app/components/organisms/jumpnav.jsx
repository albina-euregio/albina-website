import React from 'react';

export default class Jumpnav extends React.Component {
  render() {
    return (
      <div className="jumpnav">
        <a href="#page-main" title="Go to Content">Go to Content</a>
        <a href="#navigation" title="Go to Navigation">Go to Navigation</a>
        <a href="#page-footer" title="Got to Footer">Go to Footer</a>
      </div>
    );
  }
}
