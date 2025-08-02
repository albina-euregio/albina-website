import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { useIntl } from "../i18n";
import { fetchText } from "../util/fetch";
import { HeadlessContext } from "../contexts/HeadlessContext.tsx";

/*
 * Component to be used for pages with content delivered by CMS API.
 */
const StaticPage = () => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const location = useLocation();
  const headless = useContext(HeadlessContext);

  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [content, setContent] = useState("");
  const [isShareable, setIsShareable] = useState(false);

  useEffect(() => {
    (async () => {
      let url = location.pathname
        .substring(config.projectRoot)
        .replace(/^\/(headless)?/, "");
      if (!url) return;
      url = `${import.meta.env.BASE_URL}content/${url}/${lang}.html`;

      const text = await fetchText(url);
      if (
        text.includes(
          "This website requires a modern browser and JavaScript modules"
        )
      ) {
        // Due to BrowserRouter, the webserver serves index.html for any non existing file.
        // Detect this case and display an error 404.
        setTitle("Error 404");
        setContent(
          <section className="section-centered">
            Page not found: <code>{url}</code>
          </section>
        );
        setChapter("");
        setHeaderText("");
        return;
      }
      // extract title from first <h1>...</h1>
      const titlePattern = /<h1>\s*(.*?)\s*<\/h1>/;
      setTitle(titlePattern.exec(text)?.[1]);
      setContent(
        preprocessContent(text.replace(titlePattern, ""), false, headless)
      );
      setChapter(url.split("/")[0] || "");
      setHeaderText("");
      setIsShareable(!headless);
    })();
  }, [headless, lang, location.pathname]);

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
        backLink={headless && "/headless/bulletin/latest"}
      />
      {/* <section className="section-centered">{content}</section> */}
      {content}
      <div className="clearfix" />
      {isShareable ? <SmShare /> : <div className="section-padding" />}
    </>
  );
};

export default StaticPage;
