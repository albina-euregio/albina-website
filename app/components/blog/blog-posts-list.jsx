import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import TagList from "./tag-list";
import { DATE_TIME_FORMAT } from "../../util/date";

class BlogPostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const havePictures = this.props.posts.some(i => i.image);
    return (
      <div>
        {this.props.posts.map((item, i) => {
          return (
            <Link
              key={i}
              to={"/blog/" + item.blogName + "/" + item.postId}
              className="linkbox linkbox-blog-feature"
            >
              {havePictures && (
                <div className="content-image">
                  {item.image && (
                    <img src={item.image} alt={item.title} title={item.title} />
                  )}
                </div>
              )}
              <div className="content-text">
                <ul className="list-inline blog-feature-meta">
                  {/*<li className="blog-author">{item.author}</li>
                   */}
                  <li className="blog-date">
                    {this.props.intl.formatDate(item.date, DATE_TIME_FORMAT)}
                  </li>
                  <li className="blog-province">
                    {item.regions
                      .map(r =>
                        this.props.intl.formatMessage({ id: `region:${r}` })
                      )
                      .join(", ")}
                  </li>
                  <li className="blog-language">{item.lang.toUpperCase()}</li>
                </ul>
                <h1 title={item.title} className="subheader blog-feature-title">
                  {item.title}
                </h1>
                <TagList tags={item.tags} />
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default injectIntl(observer(BlogPostsList));
