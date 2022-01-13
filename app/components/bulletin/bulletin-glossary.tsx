import Tippy from "@tippyjs/react";
import React from "react";

import "tippy.js/dist/tippy.css";

import GLOSSARY_LINKS from "./bulletin-glossary-links.json";

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
    return (
      <Tippy content={glossary}>
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
