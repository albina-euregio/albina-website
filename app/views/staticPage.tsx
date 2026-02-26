import React, { useEffect, useState } from "react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { useIntl } from "../i18n";
import { fetchText } from "../util/fetch";
import { useStore } from "@nanostores/react";
import { $headless, $province } from "../appStore.ts";
import { $router } from "../components/router.ts";

/*
 * Component to be used for pages with content delivered by CMS API.
 */
const StaticPage = () => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const province = useStore($province);
  const headless = useStore($headless);
  const router = useStore($router);
  if (router?.route !== "staticName" && router?.route !== "staticSegmentName") {
    throw new Error();
  }

  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [content, setContent] = useState("");
  const [isShareable, setIsShareable] = useState(false);

  useEffect(() => {
    (async () => {
      let path = router.path;
      path = path.replace(/^\/(headless)?/, "");
      if (`/${path}`.startsWith(import.meta.env.BASE_URL)) {
        path = `/${path}`.slice(import.meta.env.BASE_URL.length);
      }
      if (!path) return;

      const url = config.staticContentNamespace?.includes(`/${path}`)
        ? `${import.meta.env.BASE_URL}content/${path}.${province}/${lang}.html`
        : `${import.meta.env.BASE_URL}content/${path}/${lang}.html`;

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
      setContent(preprocessContent(text.replace(titlePattern, ""), false));
      setChapter(url.split("/")[0] || "");
      setHeaderText("");
      setIsShareable(!headless);
    })();
  }, [headless, province, lang, router]);

  useEffect(() => {
    document
      .getElementById(router.hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [router.hash, content]);

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
      >
        {headless && (
          <a href="/bulletin/latest" className="back-link">
            {intl.formatMessage({ id: "bulletin:linkbar:back-to-bulletin" })}
          </a>
        )}
      </PageHeadline>
      {/* <section className="section-centered">{content}</section> */}
      {content}
      <div className="clearfix" />
      {isShareable ? <SmShare /> : <div className="section-padding" />}
    </>
  );
};

export default StaticPage;
