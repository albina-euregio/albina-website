// Utility to get the desktop breakpoint from CSS custom property
function getDesktopBreakpoint() {
  if (typeof window === 'undefined') return 1024;
  const value = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-desktop');
  return parseInt(value, 10) || 1024;
}
import React, { useEffect, useState } from "react";
import { useIntl } from "../i18n";
import { BlogPostPreviewItem } from "../stores/blog";
import { useStore } from "@nanostores/react";
import { $router } from "./router";

interface Entry {
  key: string;
  title?: string;
  url: string;
  "url:de"?: undefined;
  showSub?: boolean;
  showNumberNewPosts?: boolean;
  children?: Entry[];
}

interface Props {
  activeClassName: string;
  childClassName: string;
  className: string;
  entries: Entry[];
  menuItemClassName: string;
  onActiveChildMenuItem?: (e: Entry) => void;
  onActiveMenuItem?: (e: Entry) => void;
  onSelect?: (e: Entry) => void;
  onCloseAllDropdowns?: () => void;
}

let isTouchingDevice = false;

function Menu(props: Props) {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const router = useStore($router);
  const [numberNewPosts, setNumberNewPosts] = useState(0);

  useEffect(() => {
    (async () => {
      if (!props.entries.some(e => e.showNumberNewPosts)) return;
      const posts = await BlogPostPreviewItem.loadBlogPosts(
        window.config.blogs.filter(cfg => cfg.lang === lang)
      );
      const postItems = posts.map(([, p]) => p).flat();
      setNumberNewPosts(postItems.filter(p => Date.now() < p.newUntil).length);
    })();
  }, [lang, props.entries]);

  const testActive = (e: Entry, recursive = true) => {
    // Test if element (or any of its child elements, if "recursive" is set)
    // is active.
    const doTest = (loc: string, element: Entry): boolean => {
      return !!(
        element.url.split("?")[0].startsWith(loc) ||
        (recursive && element.children?.some(el => doTest(loc, el)))
      );
    };

    if (router?.path) {
      return doTest(router.path, e);
    }
    return false;
  };

  const onLinkClick = (e: Event, hasSubs: boolean) => {
    //console.log("onLinkClick jjj", isTouchingDevice, hasSubs);
    if (hasSubs && isTouchingDevice) e.preventDefault();
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  if (props.entries && props.entries.length > 0) {
    const activeItem = props.entries.find(e => testActive(e));

    // Handler to close all dropdowns at this menu level and above
    const handleCloseAllDropdowns = () => {
      setOpenDropdownIndex(null);
      if (props.onCloseAllDropdowns) {
        props.onCloseAllDropdowns();
      }
    };

    // Handlers for mouse hover to open/close dropdowns (desktop only)
    const handleMouseEnter = (index: number) => {
      if (window.innerWidth > getDesktopBreakpoint()) {
        setOpenDropdownIndex(index);
      }
    };
    const handleMouseLeave = (index: number) => {
      if (window.innerWidth > getDesktopBreakpoint()) {
        setOpenDropdownIndex(null);
      }
    };

    return (
      <ul className={props.className}>
        {props.entries.map((e, index) => (
          <li
            key={e.url + index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <MenuItem
              {...props}
              entry={e}
              isActive={e === activeItem}
              onLinkClick={onLinkClick}
              numberNewPosts={numberNewPosts}
              dropdownOpen={openDropdownIndex === index}
              setDropdownOpen={open => setOpenDropdownIndex(open ? index : null)}
              menuIndex={index}
              onCloseAllDropdowns={handleCloseAllDropdowns}
            />
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

type MenuItemProps = Props & {
  entry: Entry;
  isActive: boolean;
  onLinkClick: (e: Event, hasSubs: boolean) => void;
  numberNewPosts: number;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  menuIndex: number;
  onCloseAllDropdowns: () => void;
};
function getMenuItemTabIndex(title: string) {
  // Skip focus for empty or whitespace-only menu items
  return title && title.trim().length > 0 ? 0 : -1;
}
function MenuItem(props: MenuItemProps) {
  const e = props.entry;
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);

  let classes = props.menuItemClassName
    ? props.menuItemClassName.split(" ")
    : [];

  if (props.isActive) {
    if (props.onActiveMenuItem) {
      props.onActiveMenuItem(e);
    }
    classes.push(props.activeClassName ? props.activeClassName : "active");
  }
  if (e.showSub || (e.children && e.children.length > 0)) {
    classes.push("has-sub");
    if (props.dropdownOpen) {
      classes.push("open");
    }
  }
  const title =
    e.title ||
    intl.formatMessage({
      id: e.key ? `menu:${e.key}` : `menu${e.url.replace(/[/]/g, ":")}`
    });
  const url = e["url:" + lang] || e["url"];

  // Only focusable if title is not empty/whitespace
  const tabIndex = getMenuItemTabIndex(title);

  return (
    <>
      {url.match("^http(s)?://") ? (
        <a
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          tabIndex={tabIndex}
        >
          {title}
        </a>
      ) : (
        <a
          onTouchStart={() => {
            if (window.innerWidth > getDesktopBreakpoint()) isTouchingDevice = true;
          }}
          onClick={ev => {
            props.onLinkClick(ev, classes.includes("has-sub"));
            if (classes.includes("has-sub")) {
              props.setDropdownOpen(!props.dropdownOpen);
            }
          }}
          onKeyDown={ev => {
            if (classes.includes("has-sub") && ev.key === " ") {
              ev.preventDefault();
              props.setDropdownOpen(true);
            }
            if (ev.key === "Escape") {
              ev.preventDefault();
              props.setDropdownOpen(false);
              if (props.onCloseAllDropdowns) {
                props.onCloseAllDropdowns();
              }
            }
          }}
          href={url}
          className={classes.join(" ")}
          tabIndex={tabIndex}
        >
          {title}
          {e.showNumberNewPosts && props.numberNewPosts > 0 && (
            <small className="label blog-new">{props.numberNewPosts}</small>
          )}
        </a>
      )}
      {e.children && e.children.length > 0 && props.dropdownOpen && (
        <Menu
          className={props.childClassName}
          entries={e.children}
          menuItemClassName={props.menuItemClassName}
          activeClassName={props.activeClassName}
          onSelect={props.onSelect}
          onActiveMenuItem={props.onActiveChildMenuItem}
          onCloseAllDropdowns={props.onCloseAllDropdowns}
        />
      )}
    </>
  );
}

// closeAllDropdowns is no longer needed with the new onCloseAllDropdowns prop pattern

export default Menu;
