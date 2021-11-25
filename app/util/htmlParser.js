import React from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";

export function preprocessContent(content) {
  return htmr(content, {
    transform: {
      _(type, props, children) {
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
        }
        return React.createElement(type, props, children);
      }
    }
  });
}
