import React from "react";
import { withRouter, matchPath } from "react-router";
import { Link } from "react-router-dom";

@withRouter
class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  testActive(e, recursive = true) {
    // Test if element (or any of its child elements, if "recursive" is set)
    // is active.
    const doTest = (loc, element) => {
      return (
        matchPath(loc, element.url.split("?")[0]) != null ||
        (recursive &&
          element.children &&
          element.children.some(el => doTest(loc, el)))
      );
    };

    if (this.props.location && this.props.location.pathname) {
      return doTest(this.props.location.pathname, e);
    }
    return false;
  }

  renderMenuItem(e, activeItem) {
    const classes = this.props.menuItemClassName
      ? this.props.menuItemClassName.split(" ")
      : [];
    const isActive = activeItem && e == activeItem;

    if (isActive) {
      if (this.props.onActiveMenuItem) {
        this.props.onActiveMenuItem(e);
      }

      classes.push(
        this.props.activeClassName ? this.props.activeClassName : "active"
      );
    }
    if (e.children && e.children.length > 0) {
      classes.push("has-sub");
    }
    return (
      <li
        key={e.url}
        onClick={event => {
          event.stopPropagation();
          if (typeof this.props.onSelect === "function") {
            this.props.onSelect(e);
          }
        }}
      >
        {e.url.match("^http(s)?://") ? (
          <a href={e.url} target="_blank">
            {e.title}
          </a>
        ) : (
          <Link to={e.url} className={classes.join(" ")}>
            {e.title}
          </Link>
        )}
        {e.children && e.children.length > 0 && (
          <Menu
            className={this.props.childClassName}
            entries={e.children}
            location={this.props.location}
            onSelect={this.props.onSelect}
            onActiveMenuItem={this.props.onActiveChildMenuItem}
          />
        )}
      </li>
    );
  }

  render() {
    if (this.props.entries && this.props.entries.length > 0) {
      const activeMenuItems = this.props.entries.filter(e =>
        this.testActive(e)
      );
      const activeItem =
        activeMenuItems.length > 0
          ? activeMenuItems[0] // in case someone messed up the menu
          : null;

      return (
        <ul className={this.props.className}>
          {this.props.entries.map(e => this.renderMenuItem(e, activeItem))}
        </ul>
      );
    }
    return null;
  }
}

export default Menu;
