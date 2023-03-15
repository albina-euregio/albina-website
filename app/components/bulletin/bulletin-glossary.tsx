import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { useIntl } from "react-intl";
import { preprocessContent } from "../../util/htmlParser";
import RAW_GLOSSARY_LINKS_de from "./bulletin-glossary-de-links.json";
import GLOSSARY_CONTENT_de from "./bulletin-glossary-de-content.json";
import RAW_GLOSSARY_LINKS_en from "./bulletin-glossary-en-links.json";
import GLOSSARY_CONTENT_it from "./bulletin-glossary-it-content.json";
import RAW_GLOSSARY_LINKS_it from "./bulletin-glossary-it-links.json";
import GLOSSARY_CONTENT_en from "./bulletin-glossary-en-content.json";

export function findGlossaryStrings(
  text: string,
  locale: "de" | "en" | "it"
): string {
  if (locale !== "de" && locale !== "en" && locale !== "it") {
    return text;
  }
  let links;
  switch (locale) {
    case "de":
      links = RAW_GLOSSARY_LINKS_de;
      break;
    case "it":
      links = RAW_GLOSSARY_LINKS_it;
      break;
    case "en":
      links = RAW_GLOSSARY_LINKS_en;
      break;
  }

  const glossaryLinks = Object.fromEntries(
    Object.entries(links).flatMap(([id, phrases]) =>
      phrases
        .trim()
        .split(/\n/g)
        .map(phrase => [phrase, id])
    )
  );
  const regex = new RegExp(
    "\\b(" + Object.keys(glossaryLinks).join("|") + ")\\b",
    "g"
  );
  return text.replace(regex, substring => {
    const glossary = glossaryLinks[substring];
    return `<BulletinGlossary locale="${locale}" glossary="${glossary}">${substring}</BulletinGlossary>`;
  });
}

type Props = {
  glossary: keyof typeof GLOSSARY_CONTENT_de;
  locale: "de" | "en" | "it";
  children: JSX.Element;
};

export default function BulletinGlossary(props: Props) {
  const intl = useIntl();
  const glossary = props.glossary;
  let glossaryContent;
  switch (props.locale) {
    case "de":
      glossaryContent = GLOSSARY_CONTENT_de[glossary];
      break;
    case "it":
      glossaryContent = GLOSSARY_CONTENT_it[glossary];
      break;
    case "en":
      glossaryContent = GLOSSARY_CONTENT_en[glossary];
      break;
  }
  if (!glossaryContent) {
    return <span>{props.children}</span>;
  }
  const { heading, text, img, href, hrefCaption } = glossaryContent;
  const defHref = `https://www.avalanches.org/glossary/?lang=${props.locale}#${glossary}`;
  const attribution = `<p className="tooltip-source">(${intl.formatMessage({
    id: "glossary:source"
  })}: <a href="${href || defHref}" target="_blank">${
    hrefCaption || "EAWS"
  }</a>)</p>`;
  const html = `<h3>${heading}</h3>` + text + (img ?? "") + attribution;

  const content = preprocessContent(html);
  return (
    <Tooltip label={content} html={true} enableClick={true}>
      <a className="glossary">{props.children}</a>
    </Tooltip>
  );
}
