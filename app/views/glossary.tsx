import React, { useEffect, useMemo, useState } from "react";
import htmr, { type HtmrOptions } from "htmr";
import { useStore } from "@nanostores/react";
import PageHeadline from "../components/organisms/page-headline";
import HTMLHeader from "../components/organisms/html-header";
import { GLOSSARY_CONTENT } from "../components/bulletin/bulletin-glossary";
import { $router } from "../components/router";
import { useIntl } from "../i18n";

interface GlossaryEntry {
  ids?: Record<string, string>;
  heading: string;
  text: string;
  img?: string;
}

type Lang = keyof typeof GLOSSARY_CONTENT;

async function loadGlossary(lang: string): Promise<[Lang, GlossaryEntry[]]> {
  if (lang in GLOSSARY_CONTENT) {
    const content = await GLOSSARY_CONTENT[lang as Lang]();
    if (Object.keys(content).length) {
      return [lang as Lang, Object.values(content) as GlossaryEntry[]];
    }
  }
  return ["en", Object.values(await GLOSSARY_CONTENT.en())];
}

const entryId = (entry: GlossaryEntry, lang: Lang) =>
  entry.ids?.[lang] ?? entry.ids?.en ?? "";

/** Converts the WordPress/TinyMCE markup of avalanches.org into site markup. */
function renderHtml(html: string, anchors: Map<string, string>) {
  return htmr(html, {
    transform: {
      _(type: string, rawProps?: object, children?: React.ReactNode) {
        if (!rawProps && !children) return type;
        const props: Record<string, unknown> = { ...rawProps };
        const key = props.key as React.Key | undefined;
        if (props["data-mce-bogus"] === "all") return null;
        for (const key of Object.keys(props)) {
          if (
            key.startsWith("data-mce") ||
            !/^[a-z]/.test(key) ||
            ["border", "style", "unselectable"].includes(key)
          ) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete props[key];
          }
        }
        if (type === "span" && props.className === "wis-ce-fw-bld") {
          return <strong key={key}>{children}</strong>;
        } else if (type === "table") {
          return (
            <div key={key} className="table-container">
              <table className="pure-table pure-table-striped full-width">
                {children}
              </table>
            </div>
          );
        } else if (type === "img") {
          const srcset = String(props.srcSet ?? props.srcset ?? "");
          return (
            <img
              key={key}
              src={srcset.split(",").pop()?.trim().split(" ")[0]}
              srcSet={srcset}
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt={String(props.alt ?? "")}
              loading="lazy"
              decoding="async"
            />
          );
        } else if (type === "a" && typeof props.href === "string") {
          const url = props.href;
          const anchor = /avalanches\.org\/glossary\b|^#/.test(url)
            ? anchors.get(url.replace(/.*#/, ""))
            : undefined;
          if (anchor) {
            return (
              <a key={key} href={`#${anchor}`}>
                {children}
              </a>
            );
          }
          return (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
        return React.createElement(type, props, children);
      }
    } as HtmrOptions["transform"]
  });
}

export default function Glossary() {
  const intl = useIntl();
  const router = useStore($router);
  const [glossary, setGlossary] = useState<[Lang, GlossaryEntry[]]>();

  useEffect(() => {
    loadGlossary(intl.locale.slice(0, 2)).then(setGlossary);
  }, [intl.locale]);

  const entries = useMemo(() => {
    if (!glossary) return [];
    const [lang, entries] = glossary;
    const collator = new Intl.Collator(lang);
    const anchors = new Map<string, string>(
      entries.flatMap(entry =>
        Object.values(entry.ids ?? {}).map(id => [id, entryId(entry, lang)])
      )
    );
    return [...entries]
      .sort((a, b) => collator.compare(a.heading, b.heading))
      .map(entry => ({
        id: entryId(entry, lang),
        heading: entry.heading,
        text: renderHtml(entry.text, anchors),
        img: entry.img && renderHtml(entry.img, anchors)
      }));
  }, [glossary]);

  const hash = decodeURIComponent(router?.hash.slice(1) ?? "");
  const selected = entries.find(({ id }) => id === hash);

  useEffect(() => {
    if (selected) document.getElementById(selected.id)?.scrollIntoView();
  }, [selected]);

  const title = intl.formatMessage({
    id: "education:overview:glossary:headline"
  });
  return (
    <>
      <HTMLHeader title={title} />
      <PageHeadline
        title={title}
        subtitle={intl.formatMessage({ id: "education:subpages:subtitle" })}
      />
      <section className="section-centered">
        <details className="panel field border glossary-toc">
          <summary>
            <span className="glossary-toc-title">
              {intl.formatMessage({ id: "glossary:toc" })}
            </span>{" "}
            <span className="glossary-toc-count">
              {intl.formatMessage(
                { id: "glossary:toc:count" },
                { count: String(entries.length) }
              )}
            </span>
            <span className="icon-down-open-big glossary-toc-icon" />
          </summary>
          <ul className="square glossary-toc-list">
            {entries.map(({ id, heading }) => (
              <li key={id}>
                <a href={`#${id}`}>{heading}</a>
              </li>
            ))}
          </ul>
        </details>
        {selected && (
          <p>
            <a href="/education/glossary" className="secondary pure-button">
              {intl.formatMessage({ id: "glossary:all" })}
            </a>
          </p>
        )}
        {(selected ? [selected] : entries).map(({ id, heading, text, img }) => (
          <div key={id} id={id} className="panel field border glossary-entry">
            <div className="panel-header">
              <h2>
                <a href={`#${id}`}>{heading}</a>
              </h2>
            </div>
            {text}
            {img && <div className="glossary-images">{img}</div>}
          </div>
        ))}
      </section>
      <section className="section-centered">
        <p className="glossary-source">
          {intl.formatMessage({ id: "glossary:source" })}:{" "}
          <a
            href={`https://www.avalanches.org/glossary/?lang=${glossary?.[0] ?? "en"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            EAWS
          </a>
        </p>
      </section>
    </>
  );
}
