import React, { useRef, useEffect } from "react";
import { Tooltip } from "../../tooltips/tooltip";
import { FormattedMessage } from "../../../i18n";
import reactStringReplace from "react-string-replace";
import { preprocessContent } from "../../../util/htmlParser";
import { LabeledSlider } from "../../../util/simple-slider";

export const LabeledSliderReact = ({
  labels = [],
  initialIndex = 0,
  interactive = false,
  rotateLabelsAngle = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new LabeledSlider(containerRef.current, {
        labels,
        initialIndex,
        interactive,
        rotateLabelsAngle
      });
    }
  }, [labels, initialIndex, interactive, rotateLabelsAngle]);

  return <div ref={containerRef} />;
};

const GLOSSARY_INTERNAL_CONTENT = Object.freeze({
  ca: () => import("./internal-glossary-ca-content.json").then(d => d.default),
  de: () => import("./internal-glossary-de-content.json").then(d => d.default),
  en: () => import("./internal-glossary-en-content.json").then(d => d.default),
  es: () => import("./internal-glossary-es-content.json").then(d => d.default),
  it: () => import("./internal-glossary-it-content.json").then(d => d.default),
  oc: () => import("./internal-glossary-oc-content.json").then(d => d.default),
  fr: () => import("./internal-glossary-fr-content.json").then(d => d.default)
});

export type EnabledLanguages = keyof typeof GLOSSARY_INTERNAL_CONTENT;

type InternalGlossaryContent = Awaited<
  ReturnType<(typeof GLOSSARY_INTERNAL_CONTENT)[EnabledLanguages]>
> &
  Record<string, GlossaryEntry>;

export interface GlossaryEntry {
  ids: Record<string, string>;
  heading: string;
  text: string;
  img: string;
  source?: string;
  width?: number;
}

class InternalGlossaryReplacer {
  private constructor(
    public readonly locale: EnabledLanguages,
    public readonly content: InternalGlossaryContent
  ) {}

  static async init(locale: EnabledLanguages) {
    if (!GLOSSARY_INTERNAL_CONTENT[locale]) {
      return undefined;
    }
    return new InternalGlossaryReplacer(
      locale,
      await GLOSSARY_INTERNAL_CONTENT[locale]()
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
      // Example: __SIMPLE_SLIDER__|none,few,some,many|2|__END_SLIDER__
      //const imgParts = img.split("__END_SLIDER__");
      const [sliderPart, ...rest] = img.split("__END_SLIDER__");
      const parts = sliderPart.split("|");
      const labels = parts[1]?.split(",") ?? [];
      const initialIndex = parts[2] ? parseInt(parts[2], 10) : 0;
      const rotateLabelsAngle = parts[3] ? parseInt(parts[3], 10) : 0;
      return (
        <div style={{ margin: "1em" }}>
          {/* @ts-expect-error: LabeledSlider expects a container, so we use a ref to mount it imperatively if needed */}
          <LabeledSliderReact
            labels={labels}
            initialIndex={initialIndex}
            rotateLabelsAngle={rotateLabelsAngle}
          />
          {rest.length > 0 ? preprocessContent(rest.join(" ")) : null}
        </div>
      );
    }
    // Default: treat as HTML string
    return preprocessContent(img ?? "");
  }

  getTooltipContent(
    glossaryItem: GlossaryEntry,
    textKey: string,
    idText: string
  ) {
    const { heading, text, ids, img, source, width } = glossaryItem;
    const hasSource = source && source.toLowerCase() === "false" ? false : true;
    const anchor = ids?.[this.locale];
    const href = `https://www.avalanches.org/glossary/?lang=${this.locale}#${anchor}`;
    const content = () => (
      <>
        {heading !== idText && <h3>{heading}</h3>}
        {preprocessContent(text)}
        {img ? this.renderGlossaryImg(img) : null}
        {hasSource && (
          <p className="tooltip-source">
            (<FormattedMessage id={"glossary:source"} />:{" "}
            <a href={href} target="_blank" rel="external noreferrer">
              EAWS
            </a>
            )
          </p>
        )}
      </>
    );
    const tooltipProps: Record<string, unknown> = {
      key: textKey,
      label: content,
      html: true,
      enableClick: true,
      zIndex: 2000000 // ensure glossary tooltip is above others
    };
    if (typeof width !== "undefined") {
      tooltipProps.width = width;
    }
    return (
      <Tooltip {...tooltipProps}>
        <a className="glossary">{idText}</a>
      </Tooltip>
    );
  }

  findGlossaryStrings(text: string, textKey: string) {
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
): Promise<string | React.ReactNode | React.ReactNode[]> {
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
