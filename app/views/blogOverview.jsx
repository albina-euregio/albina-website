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
  constructor(props) {
    super(props);
    console.log(this.props.history);
    const getHistory = () => this.props.history;
    if (!window["blogStore"]) {
      window["blogStore"] = new BlogStore(getHistory);
    }

    this.store = window["blogStore"];
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };
  }

  componentDidUpdate() {
    console.log("!!!! did update");
    this.store.checkUrl();
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

  handleChangeRegion = val => {
    this.store.setRegions(val);
    this.store.update();
  };

  handleChangeLanguage = val => {
    this.store.setLanguages(val);
    this.store.update();
  };

  handleChangeYear = val => {
    this.store.searchText = "";
    this.store.year = val;
    this.store.update();
  };

  handleChangeMonth = val => {
    this.store.searchText = "";
    this.store.month = val;
    this.store.update();
  };

  handleChangeAvalancheProblem = val => {
    this.store.searchText = "";
    this.store.avalancheProblem = val;
    this.store.update();
  };

  handleChangeSearch = val => {
    this.store.searchText = val;
    this.store.avalancheProblem = "";
    this.store.year = "";
    this.store.update();
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
            value={this.regionActive}
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
        <section className="section section-padding-height section blog-page-flipper">
          <div className="section-centered">
            <PageFlipper store={this.store} />
          </div>
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
          <div className="section-centered">
            <PageFlipper store={this.store} />
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
