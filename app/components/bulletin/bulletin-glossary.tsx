import React from "react";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";
import reactStringReplace from "react-string-replace";
import { preprocessContent } from "../../util/htmlParser";

const RAW_GLOSSARY_LINKS = Object.freeze({
  ca: () => import("./bulletin-glossary-ca-links.json").then(d => d.default),
  de: () => import("./bulletin-glossary-de-links.json").then(d => d.default),
  en: () => import("./bulletin-glossary-en-links.json").then(d => d.default),
  es: () => import("./bulletin-glossary-es-links.json").then(d => d.default),
  it: () => import("./bulletin-glossary-it-links.json").then(d => d.default),
  oc: () => import("./bulletin-glossary-oc-links.json").then(d => d.default)
});

const GLOSSARY_CONTENT = Object.freeze({
  ca: () => import("./bulletin-glossary-ca-content.json").then(d => d.default),
  de: () => import("./bulletin-glossary-de-content.json").then(d => d.default),
  en: () => import("./bulletin-glossary-en-content.json").then(d => d.default),
  es: () => import("./bulletin-glossary-es-content.json").then(d => d.default),
  it: () => import("./bulletin-glossary-it-content.json").then(d => d.default),
  oc: () => import("./bulletin-glossary-oc-content.json").then(d => d.default)
});

export type EnabledLanguages = keyof typeof RAW_GLOSSARY_LINKS &
  keyof typeof GLOSSARY_CONTENT;

type GlossaryLinks = Awaited<
  ReturnType<(typeof RAW_GLOSSARY_LINKS)[EnabledLanguages]>
>;

type GlossaryContent = Awaited<
  ReturnType<(typeof GLOSSARY_CONTENT)[EnabledLanguages]>
>;

class GlossaryReplacer {
  glossaryLinks: Record<string, string>;
  regex: RegExp;

  private constructor(
    public readonly locale: EnabledLanguages,
    public readonly links: GlossaryLinks,
    public readonly content: GlossaryContent
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
    this.regex = new RegExp(
      "(" +
        [
          ...Object.keys(this.glossaryLinks),
          /<br\/>/.source,
          /<ins>[^<]*<\/ins>/.source,
          /<del>[^<]*<\/del>/.source
        ].join("|") +
        ")",
      "g"
    );
  }

  static async init(locale: EnabledLanguages) {
    if (!RAW_GLOSSARY_LINKS[locale] || !GLOSSARY_CONTENT[locale]) {
      return undefined;
    }
    return new GlossaryReplacer(
      locale,
      await RAW_GLOSSARY_LINKS[locale](),
      await GLOSSARY_CONTENT[locale]()
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

  findGlossaryStrings(textRaw: string) {
    return reactStringReplace(
      textRaw,
      this.regex,
      (substring, index, offset) => {
        if (substring.startsWith("<br")) {
          return <br key={index} />;
        } else if (substring.startsWith("<ins")) {
          const match = substring.slice("<ins>".length, -"</ins>".length);
          return (
            <ins
              key={`ins-${match}-${index}-${offset}`}
              // style={{ color: "#28a745" }}
            >
              {this.findGlossaryStrings(match)}
            </ins>
          );
        } else if (substring.startsWith("<del")) {
          const match = substring.slice("<del>".length, -"</del>".length);
          return (
            <del
              key={`del-${match}-${index}-${offset}`}
              // style={{ color: "#dc3545" }}
            >
              {this.findGlossaryStrings(match)}
            </del>
          );
        }
        const glossary = this.glossaryLinks[substring] as keyof GlossaryContent;
        const glossaryContent = this.content[glossary];
        if (!glossaryContent) {
          return <>{substring}</>;
        }
        const { heading, text, ids, img } = glossaryContent;
        const anchor = ids?.[this.locale];
        const href = `https://www.avalanches.org/glossary/?lang=${this.locale}#${anchor}`;
        const content = () => (
          <>
            <h3>{heading}</h3>
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
          <Tooltip
            key={`${substring}-${index}-${offset}`}
            label={content}
            html={true}
            enableClick={true}
          >
            <a className="glossary">{substring}</a>
          </Tooltip>
        );
      }
    );
  }
}

const GLOSSARY_REPLACER = {} as Record<
  EnabledLanguages,
  Promise<GlossaryReplacer>
>;

export async function findGlossaryStrings(
  text: string,
  locale: EnabledLanguages
): Promise<string | React.ReactNode[]> {
  GLOSSARY_REPLACER[locale] ??= GlossaryReplacer.init(locale);
  const glossaryReplacer = await GLOSSARY_REPLACER[locale];
  if (!glossaryReplacer) {
    // unsupported language
    return GlossaryReplacer.findBreaks(text);
  }
  return glossaryReplacer.findGlossaryStrings(text);
}

function escapeRegExp(string: string) {
  // https://stackoverflow.com/a/6969486
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
