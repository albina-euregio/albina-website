import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { useIntl } from "react-intl";
import { preprocessContent } from "../../util/htmlParser";
import RAW_GLOSSARY_LINKS from "./bulletin-glossary-de-links.json";
import GLOSSARY_CONTENT from "./bulletin-glossary-de-content.json";

const GLOSSARY_LINKS = Object.fromEntries(
  Object.entries(RAW_GLOSSARY_LINKS).flatMap(([id, phrases]) =>
    phrases
      .trim()
      .split(/\n/g)
      .map(phrase => [phrase, id])
  )
);

const GLOSSARY_REGEX = new RegExp(
  "\\b(" + Object.keys(GLOSSARY_LINKS).join("|") + ")\\b",
  "g"
);

if (import.meta.env.DEV) {
  const missing = Array.from(
    new Set(Object.values(GLOSSARY_LINKS).filter(id => !GLOSSARY_CONTENT[id]))
  ).join(" ");
  if (missing) console.warn("Missing glossary", missing);
}

export function findGlossaryStrings(text: string): string {
  return text.replace(GLOSSARY_REGEX, substring => {
    const glossary = GLOSSARY_LINKS[substring];
    return `<BulletinGlossary glossary="${glossary}">${substring}</BulletinGlossary>`;
  });
}

type Props = {
  glossary: keyof typeof GLOSSARY_CONTENT;
  children: JSX.Element;
};

export default function BulletinGlossary(props: Props) {
  const intl = useIntl();
  const glossary = props.glossary;
  if (!GLOSSARY_CONTENT[glossary]) {
    return <span>{props.children}</span>;
  }
  const { heading, text, img, href, hrefCaption } = GLOSSARY_CONTENT[glossary];
  const defHref = `https://www.avalanches.org/glossary/?lang=de#${glossary}`;
  const attribution = `<p className="tooltip-source">(${intl.formatMessage({
    id: "glossary:source"
  })}: <a href="${href || defHref}" target="_blank">${
    hrefCaption || "EAWS"
  }</a>)</p>`;
  const html = `<h3>${heading}</h3>` + text + (img ?? "") + attribution;

  const content = preprocessContent(html);
  return (
    <Tooltip label={content} html={true}>
      <a className="glossary">{props.children}</a>
    </Tooltip>
  );
}
