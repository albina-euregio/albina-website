import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Parser } from "html-to-react";
import BlogStore from "../stores/blogStore";
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
import TagFilter from "../components/filters/tag-filter";
import InfoBar from "../components/organisms/info-bar";
import { Link } from "react-router-dom";

class BlogOverview extends React.Component {
  _settingFilters;
  constructor(props) {
    super(props);
    const getHistory = () => this.props.history;
    if (!window["blogStore"]) {
      window["blogStore"] = new BlogStore(getHistory);
    }
    this.settingFilters = false;
    this.lastDate;
    this.messageIntervall;

    this.infoMessages = {
      loading: {
        intlId: "blog:overview:info-loading-data-slow",
        link: "/blog"
      },
      noData: { intlId: "blog:overview:info-now-data", link: "/blog" }
    };

    this.store = window["blogStore"];
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false,
      currentInfoMessage: ""
    };
  }

  renderLinkedMessage(intlId, link) {
    const msg = this.props.intl.formatHTMLMessage({
      id: intlId
    });

    // split the string at <a> and </a>
    const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/);

    return (
      <span>
        {parts.length > 1 && new Parser().parse(parts[1])}
        {parts.length > 2 && (
          <Link to={link} className="tooltip" title={parts[2]}>
            <strong>{parts[2]}</strong>
          </Link>
        )}
        {parts.length > 3 && new Parser().parse(parts[3])}
      </span>
    );
  }

  setInfoMessage() {
    let self = this;
    let infoMessage = this.state.currentInfoMessage;
    let delay;

    if (this.store.loading) {
      delay = 2000;
      infoMessage = "loading";
    } else {
      if (self.messageIntervall) {
        infoMessage = "ok";
      }
      if (this.store.postsList.length == 0) infoMessage = "noData";
    }

    console.log(
      "setInfoMessage v2",
      this.store.loading,
      this.state.currentInfoMessage,
      infoMessage,
      this.store.postsList.length
    );

    if (this.state.currentInfoMessage != infoMessage) {
      if (delay) {
        this.messageIntervall = setTimeout(() => {
          self.messageIntervall = undefined;
          if (infoMessage != self.state.currentInfoMessage)
            self.setState({ currentInfoMessage: infoMessage });
        }, delay);
      } else {
        if (this.messageIntervall) {
          clearTimeout(this.messageIntervall);
          this.messageIntervall = undefined;
        }
        if (infoMessage != this.state.currentInfoMessage)
          this.setState({ currentInfoMessage: infoMessage });
      }
    }
  }

  setLoadingIndicator() {
    //show hide loading image
    if (this.store.loading) {
      $("html").addClass("page-loading");
      $("html").removeClass("page-loaded");
    } else {
      $("html").removeClass("page-loading");
      setTimeout(() => {
        $("html").addClass("page-loaded");
      }, 100);
    }
  }

  componentDidUpdate() {
    if (!this.settingFilters) {
      this.store.checkUrl();
    }
    this.setInfoMessage();
    this.setLoadingIndicator();
  }

  componentWillReceiveProps() {
    return this._fetchData();
  }

  componentDidMount() {
    window["staticPageStore"].loadPage("/blog").then(responseParsed => {
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      });
    });
    this.setInfoMessage();
    this.setLoadingIndicator();
    return this._fetchData();
  }

  _fetchData() {
    //return this.store.load();
  }

  doStoreUpdate() {
    console.log("doStoreUpdate");
    this.store.update();
    this.settingFilters = false;
  }

  handleChangeRegion = val => {
    this.settingFilters = true;
    this.store.setRegions(val);
    this.doStoreUpdate();
  };

  handleChangeLanguage = val => {
    if (APP_DEV_MODE) console.log("new lang", val);
    this.settingFilters = true;
    this.store.setLanguages(val);
    this.doStoreUpdate();
  };

  handleChangeYear = val => {
    this.settingFilters = true;
    this.store.searchText = "";
    this.store.year = val;

    this.doStoreUpdate();
  };

  handleChangeMonth = val => {
    this.settingFilters = true;
    this.store.searchText = "";
    this.store.month = val;

    this.doStoreUpdate();
  };

  handleChangeAvalancheProblem = val => {
    this.settingFilters = true;
    this.store.searchText = "";
    this.store.problem = val;

    this.doStoreUpdate();
  };

  handleChangeSearch = val => {
    this.settingFilters = true;
    this.store.searchText = val;
    this.store.problem = "";
    this.store.year = "";

    this.doStoreUpdate();
  };

  handlePreviousPage() {
    this.settingFilters = true;
    this.store.previousPage();
    this.doStoreUpdate();
  }

  handleNextPage() {
    this.settingFilters = true;
    this.store.nextPage();
    this.doStoreUpdate();
  }

  render() {
    const classChanged = "selectric-changed";
    console.log("render v2", this.state.currentInfoMessage, this.infoMessages);
    const infoMessage = ["", "ok"].includes(this.state.currentInfoMessage)
      ? ""
      : this.renderLinkedMessage(
          this.infoMessages[this.state.currentInfoMessage].intlId,
          this.infoMessages[this.state.currentInfoMessage].link
        );

    return (
      <div>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <FilterBar
          search
          searchTitle={this.props.intl.formatMessage({
            id: "blog:search"
          })}
          searchOnChange={this.handleChangeSearch}
          searchValue={this.store.searchText}
        >
          <LanguageFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:language"
            })}
            all={this.props.intl.formatMessage({
              id: "filter:all"
            })}
            handleChange={this.handleChangeLanguage}
            value={this.store.languageActive}
            className={this.store.languageActive !== "all" ? classChanged : ""}
          />
          <ProvinceFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:province"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeRegion}
            value={this.store.regionActive}
            className={this.store.regionActive !== "all" ? classChanged : ""}
          />
          <TagFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:avalanche-problem"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeAvalancheProblem}
            value={this.store.problem}
            className={
              this.store.problem !== "all"
                ? classChanged
                : "" + this.store.searchText
                ? "disabled"
                : ""
            }
          />
          <YearFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:year"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            minYear={window["config"].get("archive.minYear")}
            handleChange={this.handleChangeYear}
            value={this.store.year}
            className={
              this.store.year !== ""
                ? classChanged
                : "" + this.store.searchText
                ? "disabled"
                : ""
            }
          />

          {
            //this.store.year && (
            <MonthFilter
              title={this.props.intl.formatMessage({
                id: "blog:filter:month"
              })}
              all={this.props.intl.formatMessage({
                id: "filter:all"
              })}
              handleChange={this.handleChangeMonth}
              value={this.store.month}
              className={
                this.store.month !== ""
                  ? classChanged
                  : "" + this.store.searchText
                  ? "disabled"
                  : ""
              }
            />
            //)
          }
          {/*
            <LanguageFilter
              title={this.props.intl.formatMessage({id: 'blog:filter:language'})}
              all={this.props.intl.formatMessage({id: 'filter:all'})}
              handleChange={this.handleChangeLanguage}
              value={this.activeLanguage} />
*/}
        </FilterBar>
        <section className="section section-padding-height section blog-page-flipper">
          {this.store.maxPages === 0 && (
            <div className="section-centered">
              {this.props.intl.formatMessage({
                id: "blog:page-flipper:no-posts"
              })}
            </div>
          )}
          {this.store.maxPages > 0 && (
            <div className="section-centered">
              <PageFlipper
                handlePreviousPage={this.handlePreviousPage.bind(this)}
                handleNextPage={this.handleNextPage.bind(this)}
                store={this.store}
              />
            </div>
          )}
        </section>
        <InfoBar message={infoMessage} />
        <section className="section-padding-height section-blog-posts">
          <div className="section-centered">
            <BlogPostsList
              posts={this.store.postsList}
              loading={this.store.loading}
            />
          </div>
        </section>
        <section className="section section-padding-height section blog-page-flipper">
          {this.store.maxPages > 0 && (
            <div className="section-centered">
              <PageFlipper
                handlePreviousPage={this.handlePreviousPage.bind(this)}
                handleNextPage={this.handleNextPage.bind(this)}
                store={this.store}
              />
            </div>
          )}
        </section>
        <div>{new Parser().parse(this.state.content)}</div>

        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(BlogOverview)));
