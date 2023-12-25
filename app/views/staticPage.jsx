import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { useIntl } from "react-intl";
import StaticPageStore from "../stores/staticPageStore";

/*
 * Component to be used for pages with content delivered by CMS API.
 */
const StaticPage = () => {
  const intl = useIntl();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [content, setContent] = useState("");
  const [isShareable, setIsShareable] = useState(false);

  // useEffect(() => {
  //   //console.log("StaticPage->useEffect", location.hash);
  //   //if(location.hash) scroll(location.hash, 2000);
  // }, [location.hash]);

  useEffect(() => {
    //console.log("StaticPage->useEffect", location.pathname);

    const site = location.pathname
      .substring(config.projectRoot)
      .replace(/^\//, "");

    _fetchData(site);
    //if(!location.hash) scroll(location.hash || "#page-main", 500);
  }, [location.pathname]);

  const _fetchData = site => {
    // remove projectRoot from the URL

    if (site) {
      StaticPageStore.loadPage(site).then(responseParsed => {
        setTitle(responseParsed.data.attributes.title);
        setChapter(
          responseParsed.data.attributes.chapter
            ? intl.formatMessage({
                id:
                  responseParsed.data.attributes.chapter + ":subpages:subtitle"
              })
            : ""
        );
        setHeaderText(responseParsed.data.attributes.header_text);
        setContent(preprocessContent(responseParsed.data.attributes.body));
        setIsShareable(responseParsed.data.attributes.sharable);
      });
    }
  };

  return (
    <>
      <HTMLHeader title={title} />
      <PageHeadline title={title} marginal={headerText} subtitle={chapter} />
      {/* <section className="section-centered">{content}</section> */}
      {content}
      <div className="clearfix" />
      {isShareable ? <SmShare /> : <div className="section-padding" />}
    </>
  );
};

export default StaticPage;
