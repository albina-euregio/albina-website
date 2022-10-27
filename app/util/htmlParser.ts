import React from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";
import BulletinGlossary from "../components/bulletin/bulletin-glossary";

export function preprocessContent(content: string, blogMode = false) {
  return htmr(content, {
    transform: {
      _(type, props: any, children) {
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
        } else if (
          blogMode &&
          type === "a" &&
          (children as any)?.some(c => c.type == "img")
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
        } else if (type === "a") {
          // no opener for external links
          props.target = "_blank";
          props.rel = "noopener";
        } else if (/BulletinGlossary/i.exec(type)) {
          return React.createElement(BulletinGlossary, props, children);
        }
        // Remove deprecated html attributes
        ["align", "border"].forEach(prop => delete props[prop]);
        return React.createElement(type, props, children);
      }
    }
  });
}
