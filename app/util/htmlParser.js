import React from "react";
import { Link } from "react-router-dom";
import { Parser, ProcessNodeDefinitions } from "html-to-react";

const defaults = new ProcessNodeDefinitions(React);
const htmlParser = new Parser();
const isValidNode = node => node.name != "style" && node.name != "script";

function replaceInternalLinksProcessor() {
  return {
    shouldProcessNode: node => {
      return (
        (node.name === "a" || node.name === "button") &&
        !node.attribs.href.includes("http://") &&
        !node.attribs.href.includes("https://") &&
        !node.attribs.href.includes("mailto") &&
        !node.attribs.href.includes("#")
      );
    },
    processNode: (node, ...args) => {
      const attrs = { to: node.attribs.href };

      Object.keys(node.attribs).forEach(k => {
        if (k === "class" || k === "classname") {
          attrs["className"] = node.attribs[k];
        } else if (k !== "href") {
          attrs[k] = node.attribs[k];
        }
      });
      return React.createElement(Link, attrs, ...args[0]);
    }
  };
}

function defaultProcessor() {
  return {
    shouldProcessNode: () => true,
    processNode: defaults.processDefaultNode
  };
}

function parseRawHtml(content, instructions = [defaultProcessor()]) {
  return htmlParser.parseWithInstructions(content, isValidNode, instructions);
}

function preprocessContent(content) {
  const instructions = [replaceInternalLinksProcessor(), defaultProcessor()];

  return parseRawHtml(content, instructions);
}

export {
  parseRawHtml,
  defaultProcessor,
  replaceInternalLinksProcessor,
  preprocessContent
};
