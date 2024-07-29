import React, { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react";
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

const BlogOverview = () => {
  const loading = useStore(BLOG_STORE.loading);
  const maxPages = useStore(BLOG_STORE.maxPages);
  const month = useStore(BLOG_STORE.month);
  const page = useStore(BLOG_STORE.page);
  const languageActive = useStore(BLOG_STORE.languageActive);
  const postsList = useStore(BLOG_STORE.postsList);
  const regionActive = useStore(BLOG_STORE.regionActive);
  const searchText = useStore(BLOG_STORE.searchText);
  const year = useStore(BLOG_STORE.year);
  const [slowLoading] = useSlowLoading();
  const intl = useIntl();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const didMountRef = useRef(false);
  let _settingFilters = false;
  const [headerText] = useState("");

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
    BLOG_STORE.init();
    BLOG_STORE.load();
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
  });

  useEffect(() => {
    if (!_settingFilters) {
      BLOG_STORE.checkUrl(searchParams);
    }
  }, [_settingFilters, location, searchParams]);

  const doStoreUpdate = () => {
    setSearchParams(BLOG_STORE.searchParams.get());
    BLOG_STORE.load();
    _settingFilters = false;
  };

  const handleChangeRegion = (val: string) => {
    _settingFilters = true;
    BLOG_STORE.setRegions(val);
    doStoreUpdate();
  };

  const handleChangeLanguage = (val: string) => {
    _settingFilters = true;
    BLOG_STORE.setLanguages(val);
    doStoreUpdate();
  };

  const handleChangeYear = (val: number | "") => {
    _settingFilters = true;
    BLOG_STORE.searchText.set("");
    BLOG_STORE.year.set(val);

    doStoreUpdate();
  };

  const handleChangeMonth = (val: number | "") => {
    _settingFilters = true;
    BLOG_STORE.searchText.set("");
    BLOG_STORE.month.set(val);

    doStoreUpdate();
  };

  const handleChangeSearch = (val: string) => {
    _settingFilters = true;
    BLOG_STORE.searchText.set(val);
    BLOG_STORE.problem.set("");
    BLOG_STORE.year.set("");

    doStoreUpdate();
  };

  const handlePreviousPage = () => {
    _settingFilters = true;
    BLOG_STORE.previousPage();
    doStoreUpdate();
  };

  const handleNextPage = () => {
    _settingFilters = true;
    BLOG_STORE.nextPage();
    doStoreUpdate();
  };

  const classChanged = "selectric-changed";

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "blog:title" })} />
      <HTMLPageLoadingScreen loading={loading} />
      <PageHeadline
        title={intl.formatMessage({ id: "blog:headline" })}
        marginal={headerText}
      />
      <FilterBar
        search
        searchTitle={intl.formatMessage({
          id: "blog:search"
        })}
        searchOnChange={handleChangeSearch}
        searchValue={searchText}
      >
        <LanguageFilter
          title={intl.formatMessage({
            id: "blog:filter:language"
          })}
          all={intl.formatMessage({
            id: "filter:all"
          })}
          handleChange={handleChangeLanguage}
          value={languageActive}
          className={languageActive !== "all" ? classChanged : ""}
        />
        <ProvinceFilter
          title={intl.formatMessage({
            id: "measurements:filter:province"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={handleChangeRegion}
          value={regionActive}
          className={regionActive !== "all" ? classChanged : ""}
        />
        <YearFilter
          title={intl.formatMessage({
            id: "blog:filter:year"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          minYear={window.config.archive.minYear}
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
          <BlogPostsList posts={postsList} loading={loading} />
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

export default observer(BlogOverview);
