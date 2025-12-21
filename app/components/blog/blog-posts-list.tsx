import React from "react";
import { Link } from "react-router-dom";
import { useIntl } from "../../i18n";
import TagList from "./tag-list";
import { DATE_TIME_FORMAT } from "../../util/date";

import type { BlogPostPreviewItem } from "../../stores/blog";

interface Props {
  posts: BlogPostPreviewItem[];
  handleChangeCategory?: (tag: string, e: React.MouseEvent) => void;
}

export default function BlogPostsList({ posts, handleChangeCategory }: Props) {
  const intl = useIntl();
  const havePictures = posts.some(i => i.image);
  return (
    <div>
      {posts.map((item, i) => {
        return (
          <Link
            key={i}
            to={`/blog/${item.blogName}/${item.postId}`}
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
                  <time dateTime={new Date(item.date).toISOString()}>
                    {intl.formatDate(item.date, DATE_TIME_FORMAT)} (
                    {intl.formatRelativeTime(new Date(item.date))})
                  </time>
                </li>
                <li className="blog-province">
                  {item.regions
                    .map(r => intl.formatMessage({ id: `region:${r}` }))
                    .join(", ")}
                </li>
                <li className="blog-language">{item.lang.toUpperCase()}</li>
              </ul>
              <h1 title={item.title} className="subheader blog-feature-title">
                {item.title}
              </h1>
              <TagList
                tags={item.tags}
                handleChangeCategory={handleChangeCategory}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
