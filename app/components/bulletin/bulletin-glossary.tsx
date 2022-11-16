import React from "react";
import { Tooltip } from "../tooltips/tooltip";

import { preprocessContent } from "../../util/htmlParser";
import GLOSSARY_LINKS from "./bulletin-glossary-de-links.json";
import GLOSSARY_CONTENT from "./bulletin-glossary-de-content.json";
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
    const { heading, text, img, href, hrefCaption } =
      GLOSSARY_CONTENT[glossary];
    const defHref = `https://www.avalanches.org/glossary/?lang=de#${glossary}`;
    const attribution = `<p className="tooltip-source">(Source: <a href="${
      href || defHref
    }" target="_blank">${hrefCaption || "EAWS"}</a>)</p>`;
    const html = `<h3>${heading}</h3>` + text + (img ?? "") + attribution;

    const content = preprocessContent(html);
    return (
      <Tooltip label={content} html={true}>
        <a className="glossary">{this.props.children}</a>
      </Tooltip>
    );
  }
}
