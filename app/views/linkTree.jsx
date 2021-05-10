import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import BlogPostsList from "../components/blog/blog-posts-list";
import BlogStore from "../stores/blogStore";
import { Link } from "react-router-dom";
import { dateToDateTimeString } from "../util/date.js";

class LinkTree extends React.Component {
  constructor(props) {
    super(props);
    this.store = new BlogStore();
  }

  componentDidMount() {
    this.store.setRegions(["trentino"]);
    this.store.setLanguages("de");
    this.store.update();
    $("#page-footer").css({ display: "none" });
    $("#page-header").css({ display: "none" });
  }

  componentWillUnmount() {
    $("#page-footer").css({ display: "" });
    $("#page-header").css({ display: "" });
  }

  render() {
    return (
      <>
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "app:title"
          })}
        />
        <section className="section-centered section-dangerscale">
          <a href="/bulletin">
            <div id="report" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/base-map.webp"
                    alt="Base Map"
                    className="warning-level-icon"
                  />
                </div>
                <div className="grid-item small-9">
                  <div className="panel-header">
                    <h4>Report</h4>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div className="section-centered">
            <BlogPostsList
              posts={this.store.postsList.slice(0, 1)}
              loading={this.store.loading}
            />
          </div>
          {this.store.postsList.map((item, i) => {
            <Link
              key={i}
              to={"/blog/" + item.blogName + "/" + item.postId}
              className="linkbox linkbox-blog-feature"
            >
              {item.image && (
                <div className="content-image">
                  {item.image && <img src={item.image} alt={item.title} />}
                </div>
              )}
              <div className="content-text">
                <ul className="list-inline blog-feature-meta">
                  {/*<li className="blog-author">{item.author}</li>
                   */}
                  <li className="blog-date">
                    {dateToDateTimeString(item.date)}
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
              </div>
            </Link>;
          })}

          <div id="blog" className="panel field border">
            <a href="/blog">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/micro-regions.webp"
                    alt="Blog"
                    className="warning-level-icon"
                  />
                </div>
                <div className="grid-item small-9">
                  <div className="panel-header">
                    <h4>Micro Regions</h4>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>
      </>
    );
  }
}
export default injectIntl(withRouter(observer(LinkTree)));
