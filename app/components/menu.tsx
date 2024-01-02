import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useIntl } from "../i18n";
import { BlogPostPreviewItem } from "../stores/blog";

type Entry = {
  key: string;
  title?: string;
  url: string;
  "url:de"?: undefined;
  showSub?: boolean;
  showNumberNewPosts?: boolean;
  children?: Entry[];
};

type Props = {
  activeClassName: string;
  childClassName: string;
  className: string;
  entries: Entry[];
  menuItemClassName: string;
  onActiveChildMenuItem?: (e: Entry) => void;
  onActiveMenuItem?: (e: Entry) => void;
  onSelect?: (e: Entry) => void;
};

const Menu = (props: Props) => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const location = useLocation();
  const [numberNewPosts, setNumberNewPosts] = useState(0);

  useEffect(() => {
    (async () => {
      if (!props.entries.some(e => e.showNumberNewPosts)) return;
      const posts = await BlogPostPreviewItem.loadBlogPosts(
        l => l === lang,
        () => true
      );
      const postItems = posts.map(([, p]) => p).flat();
      setNumberNewPosts(postItems.filter(p => Date.now() < p.newUntil).length);
    })();
  }, [lang, props.entries]);

  const testActive = (e: Entry, recursive = true) => {
    // Test if element (or any of its child elements, if "recursive" is set)
    // is active.
    const doTest = (loc, element: Entry) => {
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

  const onLinkClick = (e: Event, hasSubs: boolean) => {
    //console.log("onLinkClick jjj", window.IS_TOUCHING_DEVICE, hasSubs);
    if (hasSubs && window.IS_TOUCHING_DEVICE) e.preventDefault();
  };

  const renderMenuItem = (e: Entry, activeItem: Entry) => {
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
      intl.formatMessage({
        id: e.key ? `menu:${e.key}` : `menu${e.url.replace(/[/]/g, ":")}`
      });
    const url = e["url:" + lang] || e["url"];

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
            {e.showNumberNewPosts && numberNewPosts > 0 && (
              <small className="label blog-new">{numberNewPosts}</small>
            )}
          </Link>
        )}
        {e.children && e.children.length > 0 && (
          <Menu
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

export default Menu;
