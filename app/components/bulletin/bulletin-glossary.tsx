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

export type EnabledLanguages = keyof typeof RAW_GLOSSARY_LINKS &
  keyof typeof GLOSSARY_CONTENT;

class GlossaryReplacer {
  links: (typeof RAW_GLOSSARY_LINKS)[EnabledLanguages];
  glossaryLinks: Record<string, string>;
  regex: RegExp;

  constructor(private locale: EnabledLanguages) {
    this.links = RAW_GLOSSARY_LINKS[locale];
    this.glossaryLinks = Object.fromEntries(
      Object.entries(RAW_GLOSSARY_LINKS[locale]).flatMap(([id, phrases]) =>
        phrases
          .trim()
          .split(/\n/g)
          .filter(phrase => !!phrase)
          .map(phrase => [phrase, id])
      )
    );
    this.regex = new RegExp(
      "\\b(" + Object.keys(this.glossaryLinks).join("|") + ")\\b",
      "g"
    );
  }

  replace(text: string) {
    if (!this.links) {
      return text;
    }
    return text.replace(this.regex, substring => {
      const glossary = this.glossaryLinks[substring];
      return `<BulletinGlossary locale="${this.locale}" glossary="${glossary}">${substring}</BulletinGlossary>`;
    });
  }
}

const GLOSSARY_REPLACER = {} as Record<EnabledLanguages, GlossaryReplacer>;

export function findGlossaryStrings(
  text: string,
  locale: EnabledLanguages
): string {
  GLOSSARY_REPLACER[locale] ??= new GlossaryReplacer(locale);
  return GLOSSARY_REPLACER[locale].replace(text);
}

type Props = {
  glossary: keyof (typeof GLOSSARY_CONTENT)[EnabledLanguages];
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
  const anchor =
    GLOSSARY_CONTENT[props.locale][glossary]?.["ids"]?.[props.locale];
  const defHref = `https://www.avalanches.org/glossary/?lang=${props.locale}#${anchor}`;
  const attribution = `<p className="tooltip-source">(${intl.formatMessage({
    id: "glossary:source"
  })}: <a href="${href || defHref}" target="_blank">${
    hrefCaption || "EAWS"
  }</a>)</p>`;
  let html = `<h3>${heading}</h3>` + text + (img ?? "") + attribution;
  html = html.replace(/<img /g, '<img loading="lazy" ');
  const content = () => preprocessContent(html);
  return (
    <Tooltip label={content} html={true} enableClick={true}>
      <a className="glossary">{props.children}</a>
    </Tooltip>
  );
}
