import React from "react";
import { withRouter, matchPath } from "react-router";
import { observer } from "mobx-react";
import BlogStore from "../stores/blogStore";
import { Link } from "react-router-dom";

@withRouter
@observer
class Menu extends React.Component {
  constructor(props) {
    super(props);
    if (!window["blogStore"]) {
      const getHistory = () => self.props.history;
      window["blogStore"] = new BlogStore(getHistory);
    }
  }

  testActive(e, recursive = true) {
    // Test if element (or any of its child elements, if "recursive" is set)
    // is active.
    const doTest = (loc, element) => {
      return (
        matchPath(loc, element.url.split("?")[0]) != null || (recursive && element.children && element.children.some(el => doTest(loc, el)))
      );
    };

    if (this.props.location && this.props.location.pathname) {
      return doTest(this.props.location.pathname, e);
    }
    return false;
  }

  onLinkClick(e, hasSubs) {
    //console.log("onLinkClick jjj", window.IS_TOUCHING_DEVICE, hasSubs);
    if (hasSubs && window.IS_TOUCHING_DEVICE) e.preventDefault();
  }

  renderMenuItem(e, activeItem) {
    const classes = this.props.menuItemClassName ? this.props.menuItemClassName.split(" ") : [];
    const isActive = activeItem && e == activeItem;

    if (isActive) {
      if (this.props.onActiveMenuItem) {
        this.props.onActiveMenuItem(e);
      }

      classes.push(this.props.activeClassName ? this.props.activeClassName : "active");
    }
    if (e.showSub || (e.children && e.children.length > 0)) {
      classes.push("has-sub");
    }
    const title =
      e.title ||
      this.props.intl.formatMessage({
        id: e.key ? `menu:${e.key}` : `menu${e.url.replace(/[/]/g, ":")}`
      });
    const url = e["url:" + appStore.language] || e["url"];
    const numberNewPosts = window["blogStore"].numberNewPosts;

    return (
      <li
        key={url}
        onClick={event => {
          event.stopPropagation();
          if (typeof this.props.onSelect === "function") {
            this.props.onSelect(e);
          }
        }}
      >
        {url.match("^http(s)?://") ? (
          <a href={url} rel="noopener noreferrer" target="_blank">
            {title}
          </a>
        ) : (
          <Link
            onTouchStart={() => {
              if (window.innerWidth > 1024) window.IS_TOUCHING_DEVICE = true;
            }}
            onClick={e => {
              this.onLinkClick(e, classes.includes("has-sub"));
            }}
            to={url}
            className={classes.join(" ")}
          >
            {title}
            {url === "/blog" && numberNewPosts > 0 && <small className="label blog-new">{numberNewPosts}</small>}
          </Link>
        )}
        {e.children && e.children.length > 0 && (
          <Menu
            intl={this.props.intl}
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
      const activeMenuItems = this.props.entries.filter(e => this.testActive(e));
      const activeItem =
        activeMenuItems.length > 0
          ? activeMenuItems[0] // in case someone messed up the menu
          : null;

      return <ul className={this.props.className}>{this.props.entries.map(e => this.renderMenuItem(e, activeItem))}</ul>;
    }
    return null;
  }
}

export default Menu;
