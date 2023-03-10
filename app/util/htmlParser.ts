import React, { type AllHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";
import BulletinGlossary from "../components/bulletin/bulletin-glossary";
import { RegionsTables } from "../components/stationTable/regionTable";

export function preprocessContent(content: string, blogMode = false) {
  return htmr(content, {
    transform: {
      _(type, props: AllHTMLAttributes<HTMLLinkElement>, children) {
        if (!props && !children) {
          return type;
        } else if (type === "style" || type === "script") {
          return;
        } else if (
          (type === "a" || type === "button") &&
          !props.href.includes("http://") &&
          !props.href.includes("https://") &&
          !props.href.includes("mailto") &&
          !props.href.includes("#")
        ) {
          // replace internal links
          return React.createElement(
            Link,
            { ...props, href: undefined, to: props.href },
            children
          );
        } else if (type === "a" && props.target === "_blank") {
          // no opener for external links
          props.rel = "noopener";
        } else if (
          blogMode &&
          type === "a" &&
          Array.isArray(children) &&
          children?.some(c => c.type == "img")
        ) {
          // Turn image links into lightboxes
          props.className =
            (props.className || "") + " mfp-image modal-trigger img";
        } else if (
          blogMode &&
          type === "iframe" &&
          props?.className?.includes("YOUTUBE-iframe-video")
        ) {
          // Use Fitvids for youtube iframes
          return React.createElement(
            "div",
            { className: "fitvids", key: props.src },
            children
          );
        } else if (/BulletinGlossary/i.exec(type)) {
          return React.createElement(BulletinGlossary, props, children);
        } else if (/RegionsTables/i.exec(type)) {
          return React.createElement(RegionsTables, props, children);
        }
        // Remove deprecated html attributes
        ["align", "border"].forEach(prop => delete props[prop]);
        return React.createElement(type, props, children);
      }
    }
  });
}
