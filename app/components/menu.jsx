import React from 'react';
import { withRouter, matchPath } from 'react-router';
import { Link } from 'react-router-dom';

@withRouter class Menu extends React.Component {
  constructor(props) {
    super(props);

  }

  testActive(e, recursive = true) {
    // Test if element (or any of its child elements, if "recursive" is set)
    // is active.
    const doTest = (loc, element) => {
      return (matchPath(loc, element.url.split('?')[0]) != null)
        || ( recursive
          && element.children
          && element.children.some((el) => doTest(loc, el))
        );
    };

    if(this.props.location && this.props.location.pathname) {
      return doTest(this.props.location.pathname, e);
    }
    return false;
  }

  renderMenuItem(e) {
    const classes = [];
    const isActive = this.testActive(e);

    if(isActive) {
      classes.push('active');
    }
    if(e.children && e.children.length > 0) {
      classes.push('has-sub');
    }
    return (
      <li key={e.id} onClick={(event) => { event.stopPropagation(); if(typeof(this.props.onSelect) === 'function') { this.props.onSelect(e) } }}>
        { e.isExternal
          ? <a href={e.url} target="_blank">{e.title}</a>
          : <Link to={e.url} className={classes.join(' ')}>{e.title}</Link>
        }
        {
          (e.children && e.children.length > 0) &&
          <Menu className={this.props.childClassName} entries={e.children} location={this.props.location} onSelect={this.props.onSelect} />
        }
      </li>
    );
  }

  render() {
    if(this.props.entries && this.props.entries.length > 0) {
      return (
        <ul className={this.props.className}>
          { this.props.entries.map((e) => this.renderMenuItem(e)) }
        </ul>
      )
    }
    return null;
  }
}

export default Menu;
