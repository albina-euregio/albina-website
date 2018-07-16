import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import BlogStore from '../blogStore';
import PageHeadline from '../components/organisms/page-headline.jsx';
import FilterBar from '../components/organisms/filter-bar.jsx';
import BlogPostsList from '../components/organisms/blog-posts-list.jsx';
import ProvinceFilter from '../components/filters/province-filter.jsx';
import LanguageFilter from '../components/filters/language-filter.jsx';
import YearFilter from '../components/filters/year-filter.jsx';
import MonthFilter from '../components/filters/month-filter.jsx';

@observer class BlogOverview extends React.Component {
  constructor(props) {
    super(props);
    if(!window['blogStore']) {
      window['blogStore'] = new BlogStore();
    }
    this.store = window['blogStore'];
  }

  componentWillReceiveProps(nextProps) {
    return this._fetchData();
  }

  componentDidMount() {
    return this._fetchData();
  }

  _fetchData() {
    return this.store.load();
  }

  handleChangeRegion = (val) => {
    this.store.setRegionFilter(val);
  };

  handleChangeLanguage = (val) => {
    this.store.setLanguageFilter(val);
  };

  handleChangeYear = (val) => {
    this.store.year = val;
  };

  handleChangeMonth = (val) => {
    this.store.month = val;
  };

  @computed
  get activeRegion() {
    const rs = Object.keys(this.store.regions);
    if(rs.every((r) => this.store.regions[r].active)) {
      // if all are active, return '' (i.e. value for "All")
      return '';
    }

    // otherwise return the first active index
    return rs.find((r) => this.store.regions[r].active);
  }

  @computed
  get activeLanugage() {
    const ls = Object.keys(this.store.languages);
    if(ls.every((l) => this.store.languages[l].active)) {
      // if all are active, return '' (i.e. value for "All")
      return '';
    }

    // otherwise return the first active index
    return ls.find((l) => this.store.languages[l].active);
  }

  render() {
    return (
      <div>
        <PageHeadline title="Blog posts" subtitle="Blog" marginal="" />
        <FilterBar search={true} searchTitle="Search posts">
          <ProvinceFilter handleChange={this.handleChangeRegion} value={this.activeRegion} />
          <YearFilter
            minYear={window['config'].get('archive.minYear')}
            handleChange={this.handleChangeYear}
            value={this.store.year} />
          { this.store.year &&
            <MonthFilter handleChange={this.handleChangeMonth} value={this.store.month} />
          }
          <LanguageFilter handleChange={this.handleChangeLanguage} value={this.activeLanguage} />
        </FilterBar>
        <section className="section-padding-height section-blog-posts">
          <div className="section-centered">
            <BlogPostsList posts={this.store.getPosts()} loading={this.store.loading} />
          </div>
        </section>
      </div>
    );
  }
}
export default BlogOverview;
