import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { useIntl } from "../i18n";
import { fetchText } from "../util/fetch";

/*
 * Component to be used for pages with content delivered by CMS API.
 */
const StaticPage = () => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [location] = useLocation();

  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [content, setContent] = useState("");
  const [isShareable, setIsShareable] = useState(false);

  useEffect(() => {
    (async () => {
      let url = location.substring(config.projectRoot).replace(/^\//, "");
      if (!url) return;
      url = `${import.meta.env.BASE_URL}content/${url}/${lang}.html`;

      const text = await fetchText(url);
      // extract title from first <h1>...</h1>
      const titlePattern = /<h1>\s*(.*?)\s*<\/h1>/;
      setTitle(titlePattern.exec(text)?.[1]);
      setContent(preprocessContent(text.replace(titlePattern, "")));
      setChapter(url.split("/")[0] || "");
      setHeaderText("");
      setIsShareable(true);
    })();
  }, [lang, location]);

  useEffect(() => {
    document
      .getElementById(location.hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash, content]);

  return (
    <>
      <HTMLHeader title={title} />
      <PageHeadline
        title={title}
        marginal={headerText}
        subtitle={
          chapter
            ? intl.formatMessage({
                id: chapter + ":subpages:subtitle"
              })
            : ""
        }
      />
      {/* <section className="section-centered">{content}</section> */}
      {content}
      <div className="clearfix" />
      {isShareable ? <SmShare /> : <div className="section-padding" />}
    </>
  );
};

export default StaticPage;
