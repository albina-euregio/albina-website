import React from 'react';
import { observer } from 'mobx-react';
import { dateToDateTimeString } from '../../util/date.js';

@observer class BlogPostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {!this.props.loading && this.props.posts.map((item, i) => {
          return (
            <a key={i} className="linkbox linkbox-blog-feature" href={item.url} >
              <div className="content-image">
                {
                  item.image && <img src={item.image} />
                }
              </div>
              <div className="content-text">
                <ul className="list-inline blog-feature-meta">
                  <li className="blog-author">{item.author}</li>
                  <li className="blog-date">{dateToDateTimeString(item.date)}</li>
                  <li className="blog-province">{
                    item.regions
                      .map((r) => window['appStore'].getRegionName(r))
                      .join(', ')
                  }</li>
                  <li className="blog-language">{item.lang.toUpperCase()}</li>
                </ul>
                <h1 className="subheader blog-feature-title">{item.title}</h1>
                {
                  (Array.isArray(item.tags) && item.tags.length > 0) &&
                  <ul className="list-inline blog-list-labels">{
                    item.tags.map((t, i) => {
                      <li key={i}><span className="label">{t}</span></li>
                    })
                  }</ul>
                }
              </div>
            </a>
          );
        })}
      </div>
    );
  }
}

export default BlogPostsList;
