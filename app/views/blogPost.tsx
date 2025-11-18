import React, { useEffect, useState } from "react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import HTMLPageLoadingScreen from "../components/organisms/html-page-loading-screen";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import TagList from "../components/blog/tag-list";
import { DATE_TIME_FORMAT } from "../util/date";
import { preprocessContent } from "../util/htmlParser";
import { BlogPostPreviewItem } from "../stores/blog";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";
import { $router } from "../components/router";

const BlogPost = () => {
  const router = useStore($router);
  if (router?.route !== "blogNamePost") throw new Error();
  const params = router?.params;
  const intl = useIntl();
  const headless = useStore($headless);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  const [lang, setLanguage] = useState([]);
  const [regions, setRegions] = useState([]);
  const [languageLinks, setLanguageLinks] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (params.blogName && params.postId) {
      setLoading(true);
      BlogPostPreviewItem.loadBlogPost(params.blogName, params.postId).then(
        b => {
          setLoading(false);
          setTitle(b.title);
          setDate(b.date);
          setTags(b.tags);
          setLanguage(b.lang);
          setRegions(b.regions);
          setLanguageLinks(b.langLinks);
          setContent(preprocessContent(b.content, true));
        }
      );
    }
  }, [params.blogName, params.postId]);

  const renderLinkToBlogOverview = () => {
    return (
      <section className="section-padding section-linkbar">
        <div className="section-centered">
          <div className="grid linkbar">
            <div className="normal-4 grid-item">
              <a
                key="toBlog"
                href={`/blog${params.blogName === "tech" ? "/tech" : ""}`}
                className="icon-link icon-arrow-left"
              >
                {intl.formatMessage({ id: "blog:all-blog-posts" })}
              </a>
            </div>
            {headless && (
              <div className="normal-8 grid-item">
                <a href="/headless/bulletin/latest" className="back-link">
                  {intl.formatMessage({
                    id: "bulletin:linkbar:back-to-bulletin"
                  })}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <HTMLHeader title={title} />
      <HTMLPageLoadingScreen loading={loading} />
      {renderLinkToBlogOverview()}
      <PageHeadline
        title={title}
        subtitle={intl.formatMessage({ id: "blog:subtitle" })}
      >
        <ul className="list-inline blog-feature-meta">
          <li className="blog-date">
            {date && (
              <time dateTime={new Date(date).toISOString()}>
                {intl.formatDate(date, DATE_TIME_FORMAT)} (
                {intl.formatRelativeTime(new Date(date))})
              </time>
            )}
          </li>

          <li className="blog-province">
            {regions.map(region => (
              <a
                key={region}
                href={`${headless ? "/headless" : ""}/blog?searchLang=${lang}&region=${region}`}
              >
                {intl.formatMessage({ id: `region:${region}` })}&nbsp;&nbsp;
              </a>
            ))}
          </li>

          <li className="blog-languages">
            <ul className="list-inline blog-feature-meta-languages">
              {languageLinks.map(({ lang, link }) => (
                <li className="blog-language" key={lang}>
                  <a href={link}>{lang.toUpperCase()}</a>
                </li>
              ))}
            </ul>
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
export default BlogPost;
