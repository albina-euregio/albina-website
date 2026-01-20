import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";
import reactStringReplace from "react-string-replace";
import { preprocessContent } from "../../util/htmlParser";
import { id, tr } from "zod/locales";

const INTERNAL_GLOSSARY_LINKS = Object.freeze({
  ca: () => import("./bulletin-glossary-ca-links.json").then(d => d.default),
  de: () => import("./bulletin-glossary-de-links.json").then(d => d.default),
  en: () => import("./bulletin-glossary-en-links.json").then(d => d.default),
  es: () => import("./bulletin-glossary-es-links.json").then(d => d.default),
  it: () => import("./bulletin-glossary-it-links.json").then(d => d.default),
  oc: () => import("./bulletin-glossary-oc-links.json").then(d => d.default)
});

const GLOSSARY_INTERNAL_CONTENT = Object.freeze({
  ca: () => import("./InternalGlossary/Internal-Glossary-ca-content.json").then(d => d.default), // as GlossaryItme),
  de: () => import("./InternalGlossary/Internal-Glossary-de-content.json").then(d => d.default),
  en: () => import("./InternalGlossary/Internal-Glossary-en-content.json").then(d => d.default),
  es: () => import("./InternalGlossary/Internal-Glossary-es-content.json").then(d => d.default),
  it: () => import("./InternalGlossary/Internal-Glossary-it-content.json").then(d => d.default),
  oc: () => import("./InternalGlossary/Internal-Glossary-oc-content.json").then(d => d.default)
});

export type EnabledLanguages = keyof typeof INTERNAL_GLOSSARY_LINKS &
  keyof typeof GLOSSARY_INTERNAL_CONTENT;

type InternalGlossaryLinks = Awaited<
  ReturnType<(typeof INTERNAL_GLOSSARY_LINKS)[EnabledLanguages]>
>;

type InternalGlossaryContent = Awaited<
  ReturnType<(typeof GLOSSARY_INTERNAL_CONTENT)[EnabledLanguages]>
>;

export interface GlossaryEntry {
  ids: Record<string, string>;
  heading: string;
  text: string;
  img: string;
}

export type GlossaryItem = Record<string, GlossaryEntry>;

class InternalGlossaryReplacer {
  glossaryLinks: Record<string, string>;
  regex: RegExp;

  private constructor(
    public readonly locale: EnabledLanguages,
    public readonly links: InternalGlossaryLinks,
    public readonly content: InternalGlossaryContent
  ) {
    this.glossaryLinks = Object.fromEntries(
      Object.entries(links).flatMap(([id, phrases]) =>
        phrases
          .trim()
          .split(/\n/g)
          .filter(phrase => !!phrase)
          .map(phrase => [escapeRegExp(phrase), id])
      )
    );
    this.regex = InternalGlossaryReplacer.createRegexFromLinks(links);
  }

  static async init(locale: EnabledLanguages) {
    if (
      !GLOSSARY_INTERNAL_CONTENT[locale] ||
      !INTERNAL_GLOSSARY_LINKS[locale]
    ) {
      return undefined;
    }
    return new InternalGlossaryReplacer(
      locale,
      await INTERNAL_GLOSSARY_LINKS[locale](),
      await GLOSSARY_INTERNAL_CONTENT[locale]()
    );
  }

  static createRegexFromLinks(links: InternalGlossaryLinks): RegExp {
    const triggerWords = Object.keys(links);
    return new RegExp(
      "(" +
        [
          ...triggerWords,
          /<br\/>/.source,
          /<ins>[^<]*<\/ins>/.source,
          /<del>[^<]*<\/del>/.source
        ].join("|") +
        ")",
      "g"
    );
  }

  static findBreaks(textRaw: string): React.ReactNode[] {
    let nodes = reactStringReplace(textRaw, "<br/>", (_, i) => <br key={i} />);
    nodes = reactStringReplace(
      nodes,
      /<ins>([^<]*)<\/ins>/g,
      (match, index, offset) => (
        <ins
          key={`ins-${match}-${index}-${offset}`}
          // style={{ color: "#28a745" }}
        >
          {match}
        </ins>
      )
    );
    nodes = reactStringReplace(
      nodes,
      /<del>([^<]*)<\/del>/g,
      (match, index, offset) => (
        <del
          key={`del-${match}-${index}-${offset}`}
          // style={{ color: "#dc3545" }}
        >
          {match}
        </del>
      )
    );
    return nodes;
  }

  async getTooltipContent(
    glossaryItem: GlossaryEntry,
    textKey: string,
    idText: string
  ) {
    const { heading, text, ids, img } = glossaryItem;
    const anchor = ids?.[this.locale];
    console.log("tooltip", idText, "key " + textKey, "anchor " + anchor);
    const href = `https://www.avalanches.org/glossary/?lang=${this.locale}#${anchor}`;
    const content = () => (
      <>
        {heading !== idText && <h3>{heading}</h3>}
        {preprocessContent(text + (img ?? ""))}
        <p className="tooltip-source">
          (<FormattedMessage id={"glossary:source"} />:{" "}
          <a href={href} target="_blank" rel="external noreferrer">
            EAWS
          </a>
          )
        </p>
      </>
    );
    return (
      <Tooltip key={textKey} label={content} html={true} enableClick={true}>
        <a className="glossary">{idText}</a>
      </Tooltip>
    );
  }

  async findGlossaryStrings(text: string, textKey: string) {

    // Check if the text matches any glossary content
    console.log("Looking up glossary item for textKey:", textKey, "text:", text);
    const glossaryItem = this.content[textKey];
    console.log(
        "Found glossary item:",
        glossaryItem,
        "for textKey:",
        textKey, "and substring:",
    );
    if (!glossaryItem) {
        return <>{textKey}</>;
    }
    return this.getTooltipContent(glossaryItem, textKey, text);
    }
}

const GLOSSARY_REPLACER_INTERNAL = {} as Record<
  EnabledLanguages,
  Promise<InternalGlossaryReplacer>
>;

export async function findGlossaryStrings(
  text: string,
  locale: EnabledLanguages,
  textKey: string
): Promise<string | React.ReactNode[]> {
  GLOSSARY_REPLACER_INTERNAL[locale] ??= InternalGlossaryReplacer.init(
    locale
  ) as Promise<InternalGlossaryReplacer>;
  const glossaryReplacerInternal = await GLOSSARY_REPLACER_INTERNAL[locale];
  if (!glossaryReplacerInternal) {
    // unsupported language
    return InternalGlossaryReplacer.findBreaks(text);
  }
  return glossaryReplacerInternal.findGlossaryStrings(text, textKey);
}

function escapeRegExp(string: string) {
  // https://stackoverflow.com/a/6969486
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
