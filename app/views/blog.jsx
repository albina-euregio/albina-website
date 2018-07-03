import React from 'react';
import { observer } from 'mobx-react';
import BlogStore from '../blogStore';
import PageHeadline from '../components/organisms/page-headline.jsx';
import FilterBar from '../components/organisms/filter-bar.jsx';
import BlogPostsList from '../components/organisms/blog-posts-list.jsx';
import ProvinceFilter from '../components/filters/province-filter.jsx';
import LanguageFilter from '../components/filters/language-filter.jsx';
import YearFilter from '../components/filters/year-filter.jsx';
import MonthFilter from '../components/filters/month-filter.jsx';

@observer class Blog extends React.Component {
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

  render() {
    const filters = {
      'province': <ProvinceFilter />,
      'year': <YearFilter />,
      'month': <MonthFilter />,
      'language': <LanguageFilter />
    };

    return (
      <div>
        <PageHeadline title="Blog posts" subtitle="Blog" marginal="" />
        <FilterBar filters={filters} search={true}/>
        <section className="section-padding-height section-blog-posts">
          <div className="section-centered">
            <BlogPostsList posts={this.store.getPosts()} loading={this.store.loading} />
          </div>
        </section>
      </div>
    );
  }
}
export default Blog;
