import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as BLOG_STORE from "../stores/blogStore";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import PageFlipper from "../components/blog/page-flipper";
import FilterBar from "../components/organisms/filter-bar";
import HTMLHeader from "../components/organisms/html-header";
import BlogPostsList from "../components/blog/blog-posts-list";
import ProvinceFilter from "../components/filters/province-filter";
import LanguageFilter from "../components/filters/language-filter";
import YearFilter from "../components/filters/year-filter";
import MonthFilter from "../components/filters/month-filter";
import ControlBar from "../components/organisms/control-bar";
import HTMLPageLoadingScreen, {
  useSlowLoading
} from "../components/organisms/html-page-loading-screen";
import { FormattedMessage, useIntl } from "../i18n";
import { useStore } from "@nanostores/react";
import Selectric from "../components/selectric.tsx";
import { $province } from "../appStore.ts";
import { HeadlessContext } from "../contexts/HeadlessContext.tsx";

interface Props {
  isTechBlog: boolean;
}

const BlogPostList = ({ isTechBlog }: Props) => {
  const loading = useStore(BLOG_STORE.loading);
  const maxPages = useStore(BLOG_STORE.maxPages);
  const month = useStore(BLOG_STORE.month);
  const page = useStore(BLOG_STORE.page);
  const language = useStore(BLOG_STORE.language);
  const postsList = useStore(BLOG_STORE.postsList);
  const region = useStore(BLOG_STORE.region);
  const searchText = useStore(BLOG_STORE.searchText);
  const year = useStore(BLOG_STORE.year);
  const categories = useStore(BLOG_STORE.categories);
  const searchCategory = useStore(BLOG_STORE.searchCategory);
  const [slowLoading] = useSlowLoading();
  const intl = useIntl();
  const headless = useContext(HeadlessContext);
  const [headerText] = useState("");
  const province = useStore($province);

  const [, setSearchParams] = useSearchParams();
  const searchParamsBlogStore = useStore(BLOG_STORE.searchParams);
  useEffect(() => {
    setSearchParams(searchParamsBlogStore);
  }, [setSearchParams, searchParamsBlogStore]);
  useEffect(() => handleChangeRegion(province ?? "all"), [province]);

  const standaloneLinks = window.config.blogs.map((blog, index) => [
    index > 0 ? ", " : undefined,
    <a
      key={blog.name}
      href={
        blog.apiType === "blogger"
          ? `https://${blog.name}`
          : `https://${blog.params.id}/?lang=${blog.lang}`
      }
    >
      {blog.regions.map(region =>
        intl.formatMessage({ id: "region:" + region })
      )}{" "}
      ({blog.lang})
    </a>
  ]);

  useEffect(() => {
    BLOG_STORE.isTechBlog.set(isTechBlog);
    BLOG_STORE.load();
  }, [isTechBlog]);

  const handleChangeCategory = (val: string) => {
    BLOG_STORE.searchCategory.set(val);
    BLOG_STORE.load();
  };

  const handleChangeRegion = (val: string | "all") => {
    BLOG_STORE.region.set(val);
    BLOG_STORE.load();
  };

  const handleChangeLanguage = (val: string) => {
    BLOG_STORE.language.set(val);
    BLOG_STORE.load();
  };

  const handleChangeYear = (val: number | "" | string) => {
    BLOG_STORE.searchText.set("");
    BLOG_STORE.year.set(val ? +val : "");
    BLOG_STORE.load();
  };

  const handleChangeMonth = (val: number | "" | string) => {
    BLOG_STORE.searchText.set("");
    BLOG_STORE.month.set(val ? +val : "");
    BLOG_STORE.load();
  };

  const handleChangeSearch = (val: string) => {
    BLOG_STORE.searchText.set(val);
    BLOG_STORE.problem.set("");
    BLOG_STORE.year.set("");
    BLOG_STORE.load();
  };

  const handlePreviousPage = () => {
    BLOG_STORE.previousPage();
    BLOG_STORE.load();
  };

  const handleNextPage = () => {
    BLOG_STORE.nextPage();
    BLOG_STORE.load();
  };

  const classChanged = "selectric-changed";

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "blog:title" })} />
      <HTMLPageLoadingScreen loading={loading} />
      <PageHeadline
        title={
          isTechBlog
            ? intl.formatMessage({ id: "menu:blog:tech" })
            : intl.formatMessage({ id: "blog:headline" })
        }
        marginal={headerText}
      >
        {headless && (
          <Link to="/headless/bulletin/latest" className="back-link">
            {intl.formatMessage({ id: "bulletin:linkbar:back-to-bulletin" })}
          </Link>
        )}
      </PageHeadline>
      <FilterBar
        search
        searchTitle={intl.formatMessage({
          id: "blog:search"
        })}
        searchOnChange={handleChangeSearch}
        searchValue={searchText}
      >
        {!isTechBlog && (
          <LanguageFilter
            title={intl.formatMessage({
              id: "blog:filter:language"
            })}
            handleChange={handleChangeLanguage}
            value={language}
            className={language !== "all" ? classChanged : ""}
          />
        )}
        {!isTechBlog && (
          <ProvinceFilter
            title={intl.formatMessage({
              id: "measurements:filter:province"
            })}
            all={intl.formatMessage({ id: "filter:all" })}
            handleChange={handleChangeRegion}
            value={region}
            className={region !== "all" ? classChanged : ""}
          />
        )}
        <div>
          <p className="info">
            {intl.formatMessage({
              id: "archive:filter:categories"
            })}
          </p>
          <Selectric onChange={handleChangeCategory} value={searchCategory}>
            <option value="">{intl.formatMessage({ id: "filter:all" })}</option>
            {categories
              .filter(
                (c, i, arr) => arr.findIndex(c2 => c.name === c2.name) === i
              )
              .map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
          </Selectric>
        </div>
        <YearFilter
          title={intl.formatMessage({
            id: "blog:filter:year"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          minYear={BLOG_STORE.minYear}
          handleChange={handleChangeYear}
          value={year}
          className={year !== "" ? classChanged : ""}
        />

        {year && (
          <MonthFilter
            title={intl.formatMessage({
              id: "blog:filter:month"
            })}
            all={intl.formatMessage({
              id: "filter:all"
            })}
            handleChange={handleChangeMonth}
            value={month}
            className={month !== "" ? classChanged : ""}
          />
        )}
      </FilterBar>
      <section className="section section-padding-height section blog-page-flipper">
        {!loading && maxPages === 0 && (
          <div className="section-centered">
            {intl.formatMessage({
              id: "blog:page-flipper:no-posts"
            })}
          </div>
        )}
        {maxPages > 0 && (
          <div className="section-centered">
            <PageFlipper
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              curPage={page}
              maxPages={maxPages}
            />
          </div>
        )}
      </section>
      {loading && slowLoading && (
        <ControlBar
          addClass="fade-in"
          message={
            <FormattedMessage
              id="blog:overview:info-loading-data-slow"
              html={true}
              values={{ a: () => standaloneLinks }}
            />
          }
        />
      )}
      <section className="section-padding-height section-blog-posts">
        <div className="section-centered">
          <BlogPostsList
            posts={postsList}
            handleChangeCategory={(t, e) => {
              handleChangeCategory(t);
              e.preventDefault();
            }}
          />
        </div>
      </section>
      <section className="section section-padding-height section blog-page-flipper">
        {maxPages > 0 && (
          <div className="section-centered">
            <PageFlipper
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              curPage={page}
              maxPages={maxPages}
            />
          </div>
        )}
      </section>
      <SmShare />
    </>
  );
};

export default BlogPostList;
