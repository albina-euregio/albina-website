import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import { observer } from "mobx-react";
import { BLOG_STORE } from "../stores/blogStore";
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
// import TagFilter from "../components/filters/tag-filter";
import InfoBar from "../components/organisms/info-bar";
import { useIntl } from "react-intl";

const BlogOverview = props => {
  //console.log("BlogOverview const", BLOG_STORE);
  const [store] = useState(BLOG_STORE);
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const didMountRef = useRef(false);
  let _settingFilters = false;

  //const [title, setTitle] = useState("");
  //const [header, setHeader] = useState("");
  const [headerText, setHeaderText] = useState("");
  //const [content, setContent] = useState("");
  //const [currentContentInfoMessage, setCurrentContentInfoMessage] = useState("");
  //const [isShareable, setIsShareable] = useState(false);

  const standaloneLinks = window.config.blogs.map((blog, index) => [
    index > 0 ? ", " : undefined,
    <a key={blog.name} href={"https://" + blog.name}>
      {blog.regions.map(region =>
        intl.formatMessage({ id: "region:" + region })
      )}{" "}
      ({blog.lang})
    </a>
  ]);

  const infoMessageLevels = {
    init: {
      message: "",
      iconOn: true
    },
    loading: {
      message: intl.formatMessage(
        { id: "blog:overview:info-loading-data-slow" },
        { a: () => standaloneLinks }
      ),
      iconOn: true,
      delay: 0
    },
    noData: {
      message: intl.formatMessage(
        { id: "blog:overview:info-no-data" },
        { a: () => standaloneLinks }
      )
    },
    ok: { message: "", keep: false }
  };

  useEffect(() => {
    if (!didMountRef.current) {
      console.log("blogOverview useEffect didMount", store);
      didMountRef.current = true;
    }
  });

  useEffect(() => {
    if (!_settingFilters) {
      store.checkUrl();
    }
  }, [location]);

  const doStoreUpdate = () => {
    console.log("blogOverview doStoreUpdate", store.searchParams);
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams(store.searchParams)}`
    });
    store.update();
    _settingFilters = false;
  };

  const handleChangeRegion = val => {
    console.log("blogOverview->handleChangeRegion", val);
    _settingFilters = true;
    store.setRegions(val);
    doStoreUpdate();
  };

  const handleChangeLanguage = val => {
    // console.log("new lang", val);
    _settingFilters = true;
    store.setLanguages(val);
    doStoreUpdate();
  };

  const handleChangeYear = val => {
    _settingFilters = true;
    store.searchText = "";
    store.year = val;

    doStoreUpdate();
  };

  const handleChangeMonth = val => {
    _settingFilters = true;
    store.searchText = "";
    store.month = val;

    doStoreUpdate();
  };

  // const handleChangeAvalancheProblem = val => {
  //   _settingFilters = true;
  //   store.searchText = "";
  //   store.problem = val;

  //   doStoreUpdate();
  // };

  const handleChangeSearch = val => {
    _settingFilters = true;
    store.searchText = val;
    store.problem = "";
    store.year = "";

    doStoreUpdate();
  };

  const handlePreviousPage = () => {
    _settingFilters = true;
    store.previousPage();
    doStoreUpdate();
  };

  const handleNextPage = () => {
    _settingFilters = true;
    store.nextPage();
    doStoreUpdate();
  };

  const classChanged = "selectric-changed";
  let newLevel = "";
  if (store) {
    let newLevel = store.loading ? "loading" : "ok";
    if (newLevel === "ok" && store.postsList.length == 0) newLevel = "noData";
  }

  console.log("render", store, newLevel);

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "blog:title" })} />
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
        searchValue={store.searchText}
      >
        <LanguageFilter
          title={intl.formatMessage({
            id: "blog:filter:language"
          })}
          all={intl.formatMessage({
            id: "filter:all"
          })}
          handleChange={handleChangeLanguage}
          value={store.languageActive}
          className={store.languageActive !== "all" ? classChanged : ""}
        />
        <ProvinceFilter
          title={intl.formatMessage({
            id: "measurements:filter:province"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={handleChangeRegion}
          value={store.regionActive}
          className={store.regionActive !== "all" ? classChanged : ""}
        />
        {/* <TagFilter
          title={intl.formatMessage({
            id: "blog:filter:avalanche-problem"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          handleChange={handleChangeAvalancheProblem}
          value={store.problem}
          className={
            store.problem !== "all"
              ? classChanged
              : "" + store.searchText
              ? "disabled"
              : ""
          }
        /> */}
        <YearFilter
          title={intl.formatMessage({
            id: "blog:filter:year"
          })}
          all={intl.formatMessage({ id: "filter:all" })}
          minYear={window.config.archive.minYear}
          handleChange={handleChangeYear}
          value={store.year}
          className={store.year !== "" ? classChanged : ""}
        />

        {store.year && (
          <MonthFilter
            title={intl.formatMessage({
              id: "blog:filter:month"
            })}
            all={intl.formatMessage({
              id: "filter:all"
            })}
            handleChange={handleChangeMonth}
            value={store.month}
            className={store.month !== "" ? classChanged : ""}
          />
        )}
      </FilterBar>
      <section className="section section-padding-height section blog-page-flipper">
        {!store.loading && store.maxPages === 0 && (
          <div className="section-centered">
            {intl.formatMessage({
              id: "blog:page-flipper:no-posts"
            })}
          </div>
        )}
        {store.maxPages > 0 && (
          <div className="section-centered">
            <PageFlipper
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              curPage={store.page}
              maxPages={store.maxPages}
            />
          </div>
        )}
      </section>
      <InfoBar level={newLevel} levels={infoMessageLevels} />
      <section className="section-padding-height section-blog-posts">
        <div className="section-centered">
          <BlogPostsList posts={store.postsList} loading={store.loading} />
        </div>
      </section>
      <section className="section section-padding-height section blog-page-flipper">
        {store.maxPages > 0 && (
          <div className="section-centered">
            <PageFlipper
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              curPage={store.page}
              maxPages={store.maxPages}
            />
          </div>
        )}
      </section>
      <SmShare />
    </>
  );
};

export default observer(BlogOverview);
