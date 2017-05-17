import React from 'react';

export default class PageFooterWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer  className="pagefooter footer" >
        <div className="content has-text-centered">
          <div>
            <h1 className="title" >ALBINA</h1>
          </div>
          <div>
            <h2 className="subtitle" >FOOTER</h2>
          </div>
        </div>
      </footer >
    );
  }
}
