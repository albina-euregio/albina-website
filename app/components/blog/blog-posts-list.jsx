import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import TagList from "./tag-list";
import { dateToDateTimeString } from "../../util/date.js";

@observer
class BlogPostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {!this.props.loading &&
          this.props.posts.map((item, i) => {
            console.log(item);
            return (
              <Link
                key={i}
                to={"/blog/" + item.blogName + "/" + item.postId}
                className="linkbox linkbox-blog-feature"
              >
                <div className="content-image">
                  {item.image && <img src={item.image} />}
                </div>
                <div className="content-text">
                  <ul className="list-inline blog-feature-meta">
                    <li className="blog-author">{item.author}</li>
                    <li className="blog-date">
                      {dateToDateTimeString(item.date)}
                    </li>
                    <li className="blog-province">
                      {item.regions
                        .map(r => window["appStore"].getRegionName(r))
                        .join(", ")}
                    </li>
                    <li className="blog-language">{item.lang.toUpperCase()}</li>
                  </ul>
                  <h1 className="subheader blog-feature-title">{item.title}</h1>
                  <TagList tags={item.tags} />
                </div>
              </Link>
            );
          })}
      </div>
    );
  }
}

export default BlogPostsList;
