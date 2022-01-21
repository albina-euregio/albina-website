import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { video_init } from "../js/video";
import { useIntl } from "react-intl";

import { scroll } from "../js/scroll";
/*
 * Component to be used for pages with content delivered by CMS API.
 */
const StaticPage = props => {
  const intl = useIntl();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [content, setContent] = useState("");
  const [isShareable, setIsShareable] = useState(false);

  useEffect(() => {
    //console.log("StaticPage->useEffect", location, lastLocation);

    const site = location.pathname
      .substring(config.projectRoot)
      .replace(/^\//, "");

    _fetchData(site);
    if (location.hash) {
      scroll(hash, 2000);
    }
  }, [location.pathname]);

  const _fetchData = site => {
    // remove projectRoot from the URL

    if (site) {
      window["staticPageStore"].loadPage(site).then(responseParsed => {
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

  if (content != "") video_init();
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
