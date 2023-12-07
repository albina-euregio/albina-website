import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { useIntl } from "react-intl";
import { preprocessContent } from "../../util/htmlParser";
import GLOSSARY_CONTENT_ca from "./bulletin-glossary-ca-content.json";
import GLOSSARY_CONTENT_de from "./bulletin-glossary-de-content.json";
import GLOSSARY_CONTENT_en from "./bulletin-glossary-en-content.json";
import GLOSSARY_CONTENT_es from "./bulletin-glossary-es-content.json";
import GLOSSARY_CONTENT_it from "./bulletin-glossary-it-content.json";
import GLOSSARY_CONTENT_oc from "./bulletin-glossary-oc-content.json";
import RAW_GLOSSARY_LINKS_ca from "./bulletin-glossary-ca-links.json";
import RAW_GLOSSARY_LINKS_de from "./bulletin-glossary-de-links.json";
import RAW_GLOSSARY_LINKS_en from "./bulletin-glossary-en-links.json";
import RAW_GLOSSARY_LINKS_es from "./bulletin-glossary-es-links.json";
import RAW_GLOSSARY_LINKS_it from "./bulletin-glossary-it-links.json";
import RAW_GLOSSARY_LINKS_oc from "./bulletin-glossary-oc-links.json";

const RAW_GLOSSARY_LINKS = Object.freeze({
  ca: RAW_GLOSSARY_LINKS_ca,
  de: RAW_GLOSSARY_LINKS_de,
  en: RAW_GLOSSARY_LINKS_en,
  es: RAW_GLOSSARY_LINKS_es,
  it: RAW_GLOSSARY_LINKS_it,
  oc: RAW_GLOSSARY_LINKS_oc
});

const GLOSSARY_CONTENT = Object.freeze({
  ca: GLOSSARY_CONTENT_ca,
  de: GLOSSARY_CONTENT_de,
  en: GLOSSARY_CONTENT_en,
  es: GLOSSARY_CONTENT_es,
  it: GLOSSARY_CONTENT_it,
  oc: GLOSSARY_CONTENT_oc
});

type EnabledLanguages = keyof typeof RAW_GLOSSARY_LINKS &
  keyof typeof GLOSSARY_CONTENT;

export function findGlossaryStrings(
  text: string,
  locale: EnabledLanguages
): string {
  const links = RAW_GLOSSARY_LINKS[locale];
  if (!links) {
    return text;
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
  glossary: keyof typeof GLOSSARY_CONTENT[EnabledLanguages];
  locale: EnabledLanguages;
  children: JSX.Element;
};

export default function BulletinGlossary(props: Props) {
  const intl = useIntl();
  const glossary = props.glossary;
  const glossaryContent = GLOSSARY_CONTENT[props.locale][glossary];
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
