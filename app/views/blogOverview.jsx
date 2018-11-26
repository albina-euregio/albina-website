import React from "react";
import { computed } from "mobx";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Parser } from "html-to-react";
import BlogStore from "../stores/blogStore";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import FilterBar from "../components/organisms/filter-bar";
import BlogPostsList from "../components/blog/blog-posts-list";
import ProvinceFilter from "../components/filters/province-filter";
import LanguageFilter from "../components/filters/language-filter";
import YearFilter from "../components/filters/year-filter";
import MonthFilter from "../components/filters/month-filter";
import TagFilter from "../components/filters/tag-filter";

class BlogOverview extends React.Component {
  constructor(props) {
    super(props);
    if (!window["blogStore"]) {
      window["blogStore"] = new BlogStore();
    }
    this.store = window["blogStore"];
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };
  }

  componentWillReceiveProps(nextProps) {
    return this._fetchData();
  }

  componentDidMount() {
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
    return this.store.load();
  }

  handleChangeRegion = val => {
    this.store.setRegionFilter(val);
  };

  handleChangeLanguage = val => {
    this.store.setLanguageFilter(val);
  };

  handleChangeYear = val => {
    this.store.searchText = "";
    this.store.year = val;
  };

  handleChangeMonth = val => {
    this.store.searchText = "";
    this.store.month = val;
  };

  handleChangeAvalancheProblem = val => {
    this.store.searchText = "";
    this.store.avalancheProblem = val;
  };

  handleChangeSearch = val => {
    this.store.avalancheProblem = "";
    this.store.year = "";
    this.store.searchText = val;
  };

  @computed get activeRegion() {
    const rs = Object.keys(this.store.regions);
    if (rs.every(r => this.store.regions[r].active)) {
      // if all are active, return '' (i.e. value for "All")
      return "";
    }

    // otherwise return the first active index
    return rs.find(r => this.store.regions[r].active);
  }

  @computed get activeLanugage() {
    const ls = Object.keys(this.store.languages);
    if (ls.every(l => this.store.languages[l].active)) {
      // if all are active, return '' (i.e. value for "All")
      return "";
    }

    // otherwise return the first active index
    return ls.find(l => this.store.languages[l].active);
  }

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
            value={this.store.languageFilter}
            className={this.store.searchText ? "disabled" : ""}
          />
          <ProvinceFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:province"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeRegion}
            value={this.activeRegion}
          />
          <TagFilter
            title={this.props.intl.formatMessage({
              id: "blog:filter:avalanche-problem"
            })}
            all={this.props.intl.formatMessage({ id: "filter:all" })}
            handleChange={this.handleChangeAvalancheProblem}
            value={this.store.avalancheProblem}
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
        <section className="section-padding-height section-blog-posts">
          <div className="section-centered">
            <BlogPostsList
              posts={this.store.postsList}
              loading={this.store.loading}
            />
          </div>
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
