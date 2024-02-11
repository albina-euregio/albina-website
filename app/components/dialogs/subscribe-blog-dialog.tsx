import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";

export default function SubscribeBlogDialog() {
  const intl = useIntl();
  const blogs = {};

  config.blogs.forEach(b => {
    b.regions.forEach(r => {
      if (typeof blogs[r] === "undefined") {
        blogs[r] = [];
      }
      blogs[r].push(b);
    });
  });

  return (
    <div className="modal-subscribe-blog">
      <div className="modal-header">
        <h2>
          <FormattedMessage id="dialog:subscribe-blog:subheader" />
        </h2>
      </div>

      {Object.keys(blogs).map((r, ri) => (
        <div key={ri} className="follow-region">
          <h2 className="subheader">
            {intl.formatMessage({ id: "region:" + r })}
          </h2>
          <ul className="blog-list">
            {blogs[r].map((b, bi) => (
              <div key={bi} className="blog-details">
                {b.name} -{" "}
                <span className="blog-language">{b.lang.toUpperCase()}</span>
                <ul className="list-inline list-buttongroup">
                  <li>
                    <a
                      href={"http://" + b.name + "/feeds/posts/default"}
                      className="share-atom share-feed"
                    >
                      {intl.formatMessage({
                        id: "dialog:subscribe-blog:atom"
                      })}
                    </a>
                  </li>
                  <li>
                    <span className="buttongroup-boolean">
                      {intl.formatMessage({
                        id: "dialog:subscribe-blog:or"
                      })}
                    </span>
                  </li>
                  <li>
                    <a
                      href={"http://" + b.name + "/feeds/posts/default?alt=rss"}
                      className="share-rss share-feed"
                    >
                      {intl.formatMessage({
                        id: "dialog:subscribe-blog:rss"
                      })}
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
