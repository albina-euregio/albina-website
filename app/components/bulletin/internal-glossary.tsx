import React, { useRef, useEffect }  from "react";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";
import reactStringReplace from "react-string-replace";
import { preprocessContent } from "../../util/htmlParser";
import { LabeledSlider } from "../../util/simple-slider";

export const LabeledSliderReact = ({ labels, initialIndex, interactive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new LabeledSlider(containerRef.current, { labels, initialIndex, interactive });
    }
  }, [labels, initialIndex, interactive]);

  return <div ref={containerRef} />;
};

const INTERNAL_GLOSSARY_LINKS = Object.freeze({
  ca: () => import("./bulletin-glossary-ca-links.json").then(d => d.default),
  de: () => import("./bulletin-glossary-de-links.json").then(d => d.default),
  en: () => import("./bulletin-glossary-en-links.json").then(d => d.default),
  es: () => import("./bulletin-glossary-es-links.json").then(d => d.default),
  it: () => import("./bulletin-glossary-it-links.json").then(d => d.default),
  oc: () => import("./bulletin-glossary-oc-links.json").then(d => d.default)
});

const GLOSSARY_INTERNAL_CONTENT = Object.freeze({
  ca: () => import("./InternalGlossary/Internal-Glossary-ca-content.json").then(d => d.default),
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

  renderGlossaryImg(img: string): React.ReactNode {
    if (img && img.startsWith("__SIMPLE_SLIDER__")) {
      // Example: __SIMPLE_SLIDER__|none,few,some,many|2|true| __END_SLIDER__
      //const imgParts = img.split("__END_SLIDER__");
      const [sliderPart, ...rest] = img.split("__END_SLIDER__");
      const parts = sliderPart.split("|");
      const labels = parts[1]?.split(",") ?? [];
      const initialIndex = parts[2] ? parseInt(parts[2], 10) : 0;
      const isInteractive = parts[3] ? parts[3].toLowerCase() === "true" : false;
      return (
        <div style={{ margin: "1em 0" }}>
          {/* @ts-ignore: LabeledSlider expects a container, so we use a ref to mount it imperatively if needed */}
          <LabeledSliderReact labels={labels} initialIndex={initialIndex} interactive={isInteractive} />
          {rest.length > 0 ? preprocessContent(rest.join(" ")) : null}
        </div>
      );
    }
    // Default: treat as HTML string
    return preprocessContent(img ?? "");
  }

  async getTooltipContent(
    glossaryItem: GlossaryEntry,
    textKey: string,
    idText: string
  ) {
    const { heading, text, ids, img } = glossaryItem;
    const anchor = ids?.[this.locale];
    const href = `https://www.avalanches.org/glossary/?lang=${this.locale}#${anchor}`;
    const content = () => (
      <>
        {heading !== idText && <h3>{heading}</h3>}
        {preprocessContent(text)}
        {img ? this.renderGlossaryImg(img) : null}
        <p className="tooltip-source">
          (<FormattedMessage id={"glossary:source"} />: {" "}
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
    const glossaryItem = this.content[textKey];
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
