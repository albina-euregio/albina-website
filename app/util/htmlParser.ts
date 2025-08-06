import React, { type AllHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";
import { RegionsTables } from "../components/stationTable/regionTable";
import { ModalImage } from "../components/dialogs/albina-modal";
import OpenSourceLicenses from "../components/organisms/OpenSourceLicenses";
import { scrollIntoView } from "./scrollIntoView";

export function preprocessContent(
  content: string,
  blogMode = false,
  headless = false
) {
  return htmr(content, {
    transform: {
      _(type, props: AllHTMLAttributes<HTMLLinkElement>, children) {
        if (!props && !children) {
          return type;
        } else if (type === "style" || type === "script") {
          return;
        } else if (
          (type === "a" || type === "button") &&
          props.href &&
          !props.href.includes("http://") &&
          !props.href.includes("https://") &&
          !props.href.includes("mailto") &&
          !props.href.includes("#")
        ) {
          // replace internal links
          return React.createElement(
            Link,
            {
              ...props,
              href: undefined,
              to: (headless ? "/headless" : "") + props.href
            },
            children
          );
        } else if (type === "a" && props.href?.startsWith("#")) {
          props.onClick = e => scrollIntoView(e);
        } else if (type === "a" && props.target === "_blank") {
          // no opener for external links
          props.rel = "noopener";
        } else if (blogMode && type === "figure") {
          children = React.createElement(type, props, children);
          return React.createElement(ModalImage, undefined, children);
        } else if (blogMode && type === "img") {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          ["sizes"].forEach(prop => delete props[prop]);
        } else if (
          blogMode &&
          type === "a" &&
          Array.isArray(children) &&
          children?.some(c => c.type == "img")
        ) {
          // Turn image links into lightboxes
          props.className =
            (props.className || "") + " mfp-image modal-trigger img";
        } else if (/RegionsTables/i.exec(type)) {
          return React.createElement(RegionsTables, props, children);
        } else if (/OpenSourceLicenses/i.exec(type)) {
          return React.createElement(OpenSourceLicenses, props, children);
        }
        // Remove deprecated html attributes
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        ["align", "border"].forEach(prop => delete props[prop]);
        return React.createElement(type, props, children);
      }
    }
  });
}
