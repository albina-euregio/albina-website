import Tippy from "@tippyjs/react";
import React from "react";

import { preprocessContent } from "../../util/htmlParser";
import GLOSSARY_LINKS from "./bulletin-glossary-links.json";
import GLOSSARY_CONTENT from "./bulletin-glossary-content.json";

console.warn(
  "Missing glossary",
  Array.from(
    new Set(Object.values(GLOSSARY_LINKS).filter(id => !GLOSSARY_CONTENT[id]))
  ).join(" ")
);

export function findGlossaryStrings(text: string): string {
  return Object.entries(GLOSSARY_LINKS).reduce((e, [re, glossary]) => {
    if (!e.includes(re)) return e;
    return e.replace(
      new RegExp(`\\b${re}\\b`),
      `<BulletinGlossary glossary="${glossary}">$&</BulletinGlossary>`
    );
  }, text);
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
      <Tippy content={content} className="tippy-tooltip custom-html-theme">
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
