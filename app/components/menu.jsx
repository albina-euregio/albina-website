import React from "react";
import { useLocation, matchPath } from "react-router";
import { observer } from "mobx-react";
import { BLOG_STORE } from "../stores/blogStore";
import { Link } from "react-router-dom";
import { APP_STORE } from "../appStore";

const Menu = props => {
  const location = useLocation();

  const testActive = (e, recursive = true) => {
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

    if (location && location.pathname) {
      return doTest(location.pathname, e);
    }
    return false;
  };

  const onLinkClick = (e, hasSubs) => {
    //console.log("onLinkClick jjj", window.IS_TOUCHING_DEVICE, hasSubs);
    if (hasSubs && window.IS_TOUCHING_DEVICE) e.preventDefault();
  };

  const renderMenuItem = (e, activeItem) => {
    const classes = props.menuItemClassName
      ? props.menuItemClassName.split(" ")
      : [];
    const isActive = activeItem && e == activeItem;

    if (isActive) {
      if (props.onActiveMenuItem) {
        props.onActiveMenuItem(e);
      }

      classes.push(props.activeClassName ? props.activeClassName : "active");
    }
    if (e.showSub || (e.children && e.children.length > 0)) {
      classes.push("has-sub");
    }
    const title =
      e.title ||
      props.intl.formatMessage({
        id: e.key ? `menu:${e.key}` : `menu${e.url.replace(/[/]/g, ":")}`
      });
    const url = e["url:" + APP_STORE.language] || e["url"];
    const numberNewPosts = BLOG_STORE.numberNewPosts;

    return (
      <li
        key={url}
        onClick={event => {
          event.stopPropagation();
          if (typeof props.onSelect === "function") {
            props.onSelect(e);
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
              onLinkClick(e, classes.includes("has-sub"));
            }}
            to={url}
            className={classes.join(" ")}
          >
            {title}
            {url === "/blog" && numberNewPosts > 0 && (
              <small className="label blog-new">{numberNewPosts}</small>
            )}
          </Link>
        )}
        {e.children && e.children.length > 0 && (
          <Menu
            intl={props.intl}
            className={props.childClassName}
            entries={e.children}
            location={location}
            onSelect={props.onSelect}
            onActiveMenuItem={props.onActiveChildMenuItem}
          />
        )}
      </li>
    );
  };

  if (props.entries && props.entries.length > 0) {
    const activeMenuItems = props.entries.filter(e => testActive(e));
    const activeItem =
      activeMenuItems.length > 0
        ? activeMenuItems[0] // in case someone messed up the menu
        : null;

    return (
      <ul className={props.className}>
        {props.entries.map(e => renderMenuItem(e, activeItem))}
      </ul>
    );
  }
  return null;
};

export default observer(Menu);
