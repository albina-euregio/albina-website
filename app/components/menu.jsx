import React from 'react';
import { withRouter, matchPath } from 'react-router';
import { Link } from 'react-router-dom';

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  testActive(e, recursive = true) {
    // TODO: use this.props.location.pathname instead of calculating the pathname
    const pathname =
      window.location.pathname.substr(config.get('projectRoot').length - 1);
    return (matchPath(pathname, e.url) != null)
      || ( recursive
        && e.children
        && e.children.some((el) => this.testActive(el))
      );
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
      <li key={e.id}>
        { e.isExternal
          ? <a href={e.url} target="_blank">{e.title}</a>
          : <Link to={e.url} className={classes.join(' ')}>{e.title}</Link>
        }
        {
          (isActive && e.children && e.children.length > 0) &&
          <Menu className={this.props.childClassName} entries={e.children} />
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

export default withRouter(Menu);
