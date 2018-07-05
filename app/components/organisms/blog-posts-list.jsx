import React from 'react';
import { observer } from 'mobx-react';
import { parseDate, dateToDateTimeString } from '../../util/date.js';

@observer class BlogPostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  getPreviewImage(images) {
    // return the first image 
    if(Array.isArray(images) && images.length > 0) {
      return images[0].url;
    }
    return '';
  }

  render() {
    return (
      <div>
        {!this.props.loading && this.props.posts.map((item, i) => {
          const img = this.getPreviewImage(item.images);
          return (
            <a key={i} className="linkbox linkbox-blog-feature" href={item.url} >
              <div className="content-image">
                {
                  img && <img src={img} />
                }
              </div>
              <div className="content-text">
                <ul className="list-inline blog-feature-meta">
                  <li className="blog-author">{item.author.displayName}</li>
                  <li className="blog-date">{dateToDateTimeString(parseDate(item.published))}</li>
                  <li className="blog-province">{
                    item.regions
                      .map((r) => window['appStore'].getRegionName(r))
                      .join(', ')
                  }</li>
                  <li className="blog-language">{item.lang.toUpperCase()}</li>
                </ul>
                <h1 className="subheader blog-feature-title">{item.title}</h1>
              </div>
            </a>
          );
        })}
      </div>
    );
  }
}

export default BlogPostsList;
