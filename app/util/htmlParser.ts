import React, { type AllHTMLAttributes } from "react";
import htmr from "htmr";
import { RegionsTables } from "../components/organisms/regionTable";
import { ModalImage } from "../components/dialogs/albina-modal";
import OpenSourceLicenses from "../components/organisms/OpenSourceLicenses";
import { scrollIntoView } from "./scrollIntoView";

function findImageAlt(node: React.ReactNode): string | undefined {
  if (!React.isValidElement(node)) return undefined;
  const props = node.props as AllHTMLAttributes<HTMLImageElement>;
  if (node.type === "img") return props.alt || undefined;
  return React.Children.toArray(props.children).map(findImageAlt).find(Boolean);
}

/** Show the alt text as picture meta inside every figure of the given node. */
function withPictureMeta(node: React.ReactNode): React.ReactNode {
  const alt = findImageAlt(node);
  if (!alt) return node;
  const meta = React.createElement(
    "div",
    { className: "bulletin-report-picture-meta" },
    React.createElement("span", { className: "text" }, alt)
  );
  const append = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement<AllHTMLAttributes<HTMLElement>>(node)) {
      return node;
    }
    const children = React.Children.toArray(node.props.children);
    return node.type === "figure"
      ? React.cloneElement(node, undefined, ...children, meta)
      : React.cloneElement(node, undefined, ...children.map(append));
  };
  return append(node);
}

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
          props.href &&
          !props.href.includes("http://") &&
          !props.href.includes("https://") &&
          !props.href.includes("mailto") &&
          !props.href.includes("#")
        ) {
          // replace internal links
          return React.createElement(type, props, children);
        } else if (type === "a" && props.href?.startsWith("#")) {
          props.onClick = e => scrollIntoView(e);
        } else if (type === "a" && props.target === "_blank") {
          // no opener for external links
          props.rel = "noopener";
        } else if (
          blogMode &&
          type === "figure" &&
          props.className?.includes("wp-block-gallery")
        ) {
          // Turn WordPress galleries into bulletin report galleries
          const items = React.Children.toArray(children).filter(
            child => typeof child !== "string" || !!child.trim()
          );
          const isCaption = (child: React.ReactNode) =>
            React.isValidElement(child) && child.type === "figcaption";
          return React.createElement(
            React.Fragment,
            undefined,
            React.createElement(
              "ul",
              { className: "list-plain bulletin-report-gallery modal-gallery" },
              items
                .filter(child => !isCaption(child))
                .map((child, index) =>
                  React.createElement(
                    "li",
                    { key: index, className: "bulletin-report-gallery-item" },
                    withPictureMeta(child)
                  )
                )
            ),
            items.filter(isCaption)
          );
        } else if (blogMode && type === "figure") {
          children = React.createElement(type, props, children);
          return React.createElement(ModalImage, undefined, children);
        } else if (
          blogMode &&
          type === "img" &&
          !props.src?.startsWith("/content_files")
        ) {
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
        // Remove deprecated or invalid html attributes
        if (props) {
          Object.keys(props).forEach(prop => {
            if (prop.startsWith("#")) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete props[prop];
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          ["align", "border"].forEach(prop => delete props[prop]);
        }
        return React.createElement(type, props, children);
      }
    }
  });
}
