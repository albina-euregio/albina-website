import React from "react";
import { computed } from "mobx";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Parser } from "html-to-react";
import BlogStore from "../stores/blogStore";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import PageFlipper from "../components/blog/page-flipper";
import FilterBar from "../components/organisms/filter-bar";
import BlogPostsList from "../components/blog/blog-posts-list";
import ProvinceFilter from "../components/filters/province-filter";
import LanguageFilter from "../components/filters/language-filter";
import YearFilter from "../components/filters/year-filter";
import MonthFilter from "../components/filters/month-filter";
import TagFilter from "../components/filters/tag-filter";

class BlogOverview extends React.Component {
  _settingFilters;
  constructor(props) {
    super(props);
    console.log(this.props.history);
    const getHistory = () => this.props.history;
    if (!window["blogStore"]) {
      window["blogStore"] = new BlogStore(getHistory);
    }
    this.settingFilters = false;

    this.store = window["blogStore"];
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };
  }

  componentDidUpdate() {
    //console.log("!!!! did update");
    if (!this.settingFilters) {
      this.store.checkUrl();
    }
  }

  componentWillReceiveProps(nextProps) {
    return this._fetchData();
  }

  componentDidMount() {
    console.log("didMount");
    window["staticPageStore"].loadPage("/blog").then(response => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      });
    });

    return this._fetchData();
  }

  _fetchData() {
    //return this.store.load();
  }

  doStoreUpdate() {
    this.store.update();
    this.settingFilters = false;
  }

  handleChangeRegion = val => {
    this.settingFilters = true;
    this.store.setRegions(val);
    this.doStoreUpdate();
  };

  handleChangeLanguage = val => {
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

  render() {
    return (
      <div>
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
            className={this.store.searchText ? "disabled" : ""}
          />
          <ProvinceFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:province"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeRegion}
            value={this.store.regionActive}
          />
          <TagFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:avalanche-problem"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeAvalancheProblem}
            value={this.store.problem}
            className={this.store.searchText ? "disabled" : ""}
          />
          <YearFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:year"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            minYear={window["config"].get("archive.minYear")}
            handleChange={this.handleChangeYear}
            value={this.store.year}
            className={this.store.searchText ? "disabled" : ""}
          />

          {this.store.year && (
            <MonthFilter
              title={this.props.intl.formatMessage({
                id: "blog:filter:month"
              })}
              all={this.props.intl.formatMessage({
                id: "filter:all"
              })}
              handleChange={this.handleChangeMonth}
              value={this.store.month}
              className={this.store.searchText ? "disabled" : ""}
            />
          )}
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
              <PageFlipper store={this.store} />
            </div>
          )}
        </section>
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
              <PageFlipper store={this.store} />
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
