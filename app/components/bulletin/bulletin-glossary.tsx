import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { useIntl } from "react-intl";
import { preprocessContent } from "../../util/htmlParser";
import RAW_GLOSSARY_LINKS_de from "./bulletin-glossary-de-links.json";
import GLOSSARY_CONTENT_de from "./bulletin-glossary-de-content.json";
import RAW_GLOSSARY_LINKS_en from "./bulletin-glossary-en-links.json";
import GLOSSARY_CONTENT_en from "./bulletin-glossary-en-content.json";

export function findGlossaryStrings(text: string, locale: "de" | "en"): string {
  if (locale !== "de" && locale !== "en") {
    return text;
  }
  const links = locale === "de" ? RAW_GLOSSARY_LINKS_de : RAW_GLOSSARY_LINKS_en;
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
  locale: "de" | "en";
  children: JSX.Element;
};

export default function BulletinGlossary(props: Props) {
  const intl = useIntl();
  const glossary = props.glossary;
  const glossaryContent =
    props.locale === "de"
      ? GLOSSARY_CONTENT_de[glossary]
      : GLOSSARY_CONTENT_en[glossary];
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
