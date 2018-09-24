import React from 'react'
import { Link } from 'react-router-dom'
import { Parser, ProcessNodeDefinitions } from 'html-to-react'

const defaults = new ProcessNodeDefinitions(React)
const htmlParser = new Parser()
const isValidNode = node =>
  node.name != 'style' && node.name != 'script'

function replaceInternalLinksProcessor() {
  return {
    shouldProcessNode: node => {
      return node.name == 'a' // && node.attribs.href.match(/^\/[^/]+/)
    },
    processNode: (node, ...args) => {
      const attrs = { to: node.attribs.href }

      Object.keys(node.attribs).forEach(k => {
        if (k === 'class' || k === 'classname') {
          attrs['className'] = node.attribs[k]
        } else if (k !== 'href') {
          attrs[k] = node.attribs[k]
        }
      })
      return React.createElement(Link, attrs, ...args[0])
    }
  }
}

function defaultProcessor() {
  return {
    shouldProcessNode: () => true,
    processNode: defaults.processDefaultNode
  }
}

function parseRawHtml(content, instructions = [defaultProcessor()]) {
  return htmlParser.parseWithInstructions(
    content,
    isValidNode,
    instructions
  )
}

function preprocessContent(content) {
  const defaults = new ProcessNodeDefinitions(React)

  const matches = config
    .get('apis.content')
    .match(/^(https?:)?\/\/([^/]+)/)
  let cmsHost = ''
  if (matches && matches.length == 3) {
    const proto = matches[1] ? matches[1] : window.location.protocol
    const host = matches[2]
    cmsHost = proto + '//' + host
  }

  const instructions = [
    {
      // Fix image paths for CMS-relative URLs
      shouldProcessNode: node => {
        return node.name == 'img' && node.attribs.src.match(/^\//)
      },
      processNode: (node, ...args) => {
        node.attribs.src = cmsHost + node.attribs.src
        return defaults.processDefaultNode(node, ...args)
      }
    },
    replaceInternalLinksProcessor(),
    defaultProcessor()
  ]
  return parseRawHtml(content, instructions)
}

export {
  parseRawHtml,
  defaultProcessor,
  replaceInternalLinksProcessor,
  preprocessContent
}
