import React from 'react';
import { Link } from 'react-router-dom';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';

const defaults = new ProcessNodeDefinitions(React);
const htmlParser = new Parser();
const isValidNode = () => true;

function replaceInternalLinksProcessor() {
  return {
    shouldProcessNode: (node) => {
      return (node.name == 'a' && node.attribs.href.match(/^\/[^/]+/));
    },
    processNode: (node, ...args) => {
      const attrs = {to: node.attribs.href};
      Object.keys(node.attribs).forEach((k) => {
        if(k == 'class') {
          attrs['className'] = node.attribs.class;
        } else if(k != 'href') {
          attrs[k] = node.attribs[k];
        }
      });
      return React.createElement(
        Link,
        attrs,
        ...args[0]
      );
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

export { parseRawHtml, defaultProcessor, replaceInternalLinksProcessor }
