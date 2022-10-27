import React from "react";
import { Tooltip } from "../tooltips/tooltip";

import { preprocessContent } from "../../util/htmlParser";
import GLOSSARY_LINKS from "./bulletin-glossary-links.json";
import GLOSSARY_CONTENT from "./bulletin-glossary-content.json";
const GLOSSARY_REGEX = new RegExp(
  "\\b(" + Object.keys(GLOSSARY_LINKS).join("|") + ")\\b",
  "g"
);

console.warn(
  "Missing glossary",
  Array.from(
    new Set(Object.values(GLOSSARY_LINKS).filter(id => !GLOSSARY_CONTENT[id]))
  ).join(" ")
);

export function findGlossaryStrings(text: string): string {
  return text.replace(GLOSSARY_REGEX, substring => {
    const glossary = GLOSSARY_LINKS[substring];
    return `<BulletinGlossary glossary="${glossary}">${substring}</BulletinGlossary>`;
  });
}

type Props = {
  glossary: string;
};

export default class BulletinGlossary extends React.Component<Props> {
  render() {
    const glossary = this.props.glossary;
    if (!GLOSSARY_CONTENT[glossary]) {
      return <span>{this.props.children}</span>;
    }
    const { text, img, ref } = GLOSSARY_CONTENT[glossary];
    const referenceLink =
      '<p className="tooltip-source">' +
      (ref != null
        ? ref
        : '<a href="https://www.avalanches.org/glossary" target="_blank">EAWS</a>') +
      "</p>";
    const content = preprocessContent(text + (img ?? "") + referenceLink);
    return (
      <Tooltip label={content} html={true}>
        <a
          className="glossary"
          // href={`https://www.avalanches.org/glossary/?lang=de#${glossary}`}
        >
          {this.props.children}
        </a>
      </Tooltip>
    );
  }
}
