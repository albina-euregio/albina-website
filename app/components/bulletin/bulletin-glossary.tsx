import Tippy from "@tippyjs/react";
import React from "react";

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
    const text = GLOSSARY_CONTENT[glossary]?.text;
    const content = text ? preprocessContent(text) : "???";
    return (
      <Tippy
        content={content}
        delay={700}
        className="tippy-tooltip custom-html-theme"
      >
        <a
          className="glossary"
          href={`https://www.avalanches.org/glossary/?lang=de#${glossary}`}
        >
          {this.props.children}
        </a>
      </Tippy>
    );
  }
}
