import React from 'react';
import { observer } from 'mobx-react';
import { parseDate, dateToDateTimeString } from '../../util/date.js';

@observer class BlogPostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  getImageFromContent(html) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, 'text/html');
    const img = parsedHtml.querySelector('img');
    return img ? img.src : '';
  }

  render() {
    return (
      <div>
        {!this.props.loading && this.props.posts.map((item, i) => {
          const img = this.getImageFromContent(item.content);
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
                  <li className="blog-province">Tirol</li>
                  <li className="blog-language">DE</li>
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
