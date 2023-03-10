import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { observer } from "mobx-react";
import PageHeadline from "../components/organisms/page-headline";
import HTMLPageLoadingScreen from "../components/organisms/html-page-loading-screen";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import TagList from "../components/blog/tag-list";
import { DATE_TIME_FORMAT, parseDate } from "../util/date";
import { parseTags } from "../util/tagging";
import { modal_init } from "../js/modal";
import { video_init } from "../js/video";
import { BLOG_STORE } from "../stores/blogStore";
import { preprocessContent } from "../util/htmlParser";

const BlogPost = () => {
  const params = useParams();
  const intl = useIntl();

  const [title, setTitle] = useState("");
  //const [author, setauthor] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  const [regions, setRegions] = useState([]);
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const blogConfig = window.config.blogs.find(
      e => e.name === params.blogName
    );
    if (blogConfig && params.postId) {
      BLOG_STORE.loadBlogPost(blogConfig.params.id, params.postId)
        .then(b => {
          setTitle(b.title);
          setDate(parseDate(b.published));
          setTags(parseTags(b.labels));
          setRegions(blogConfig.regions);
          setLanguage(blogConfig.lang);
          setContent(preprocessContent(b.content, true));
        })
        .then(() => {
          window.setTimeout(() => {
            modal_init();
            video_init();
          }, 1000);
        });
    }
  }, [params.blogName, params.postId]);

  const renderLinkToBlogOverview = () => {
    return (
      <section className="section-padding section-linkbar">
        <div className="section-centered">
          <div className="grid linkbar">
            <div className="normal-4 grid-item">
              <Link
                key="toBlog"
                to={"/blog"}
                className="icon-link icon-arrow-left"
              >
                {intl.formatMessage({ id: "blog:all-blog-posts" })}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <HTMLHeader title={title} />
      <HTMLPageLoadingScreen loading={BLOG_STORE.loading} />
      {renderLinkToBlogOverview()}
      <PageHeadline
        title={title}
        subtitle={intl.formatMessage({ id: "blog:subtitle" })}
      >
        <ul className="list-inline blog-feature-meta">
          <li className="blog-date">
            {date && intl.formatDate(date, DATE_TIME_FORMAT)}
          </li>
          <li className="blog-province">
            {regions.map(region => (
              <Link key={region} to={"/blog?searchLang=all&region=" + region}>
                {intl.formatMessage({ id: `region:${region}` })}
              </Link>
            ))}
          </li>
          <li className="blog-language">
            <Link to={"/blog?region=&searchLang=" + language}>
              {language.toUpperCase()}
            </Link>
          </li>
        </ul>
        <TagList tags={tags} />
      </PageHeadline>
      <section className="section-centered ">
        <section className="panel blog-post">{content}</section>
      </section>
      {renderLinkToBlogOverview()}
      <SmShare />
    </>
  );
};
export default observer(BlogPost);
