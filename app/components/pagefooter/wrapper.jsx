import React from 'react';
import {Link} from 'react-router-dom';

export default class PageFooterWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="pagefooter footer" >
        <div className="content has-text-centered">
          <div>
            <h1 className="title" >ALBINA</h1>
          </div>
          <div>
            <h2 className="subtitle" >FOOTER</h2>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/imprint">Imprint</Link></li>
            </ul>
          </div>
        </div>
      </footer >
    );
  }
}
