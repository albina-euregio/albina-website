import React from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import TagList from "../components/blog/tag-list";
import { parseDate, dateToDateTimeString } from "../util/date";
import { parseTags } from "../util/tagging";
import { modal_init } from "../js/modal";
import { video_init } from "../js/video";
import { fetchJSON } from "../util/fetch";

class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      autor: "",
      date: "",
      tags: [],
      regions: [],
      language: "",
      content: ""
    };
  }

  componentDidMount() {
    this._fetchData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this._fetchData(this.props);
    }
  }

  _preprocessContent(content) {
    const deprecatedAttrs = ["align", "border"];
    return htmr(content, {
      transform: {
        _(type, props, children) {
          if (!props && !children) {
            return type;
          } else if (type == "a" && children?.some(c => c.type == "img")) {
            // Turn image links into lightboxes
            props.className =
              (props.className || "") + " mfp-image modal-trigger img";
          } else if (
            type == "iframe" &&
            props?.className?.includes("YOUTUBE-iframe-video")
          ) {
            // Use Fitvids for youtube iframes
            return React.createElement(
              "div",
              { className: "fitvids", key: props.src },
              children
            );
          }
          // Remove deprecated html attributes
          deprecatedAttrs.forEach(prop => delete props[prop]);
          return React.createElement(type, props, children);
        }
      }
    });
  }

  _fetchData(props) {
    const blogName = props.match.params.blogName;
    const postId = props.match.params.postId;

    const blogConfig = window.config.blogs.find(e => {
      return e.name === blogName;
    });
    if (blogConfig && postId) {
      const url =
        window.config.apis.blogger +
        blogConfig.params.id +
        "/posts/" +
        postId +
        "?key=" +
        encodeURIComponent(window.config.apiKeys.google);
      fetchJSON(url)
        .then(b => {
          this.setState({
            title: b.title,
            //author: b.author.displayName,
            date: parseDate(b.published),
            tags: parseTags(b.labels),
            regions: blogConfig.regions,
            language: blogConfig.lang,
            content: this._preprocessContent(b.content)
          });
        })
        .then(() => {
          window.setTimeout(() => {
            modal_init();
            video_init();
          }, 1000);
        });
    }
  }

  /*<li className="blog-author">{this.state.author}</li> */
  render() {
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          subtitle={this.props.intl.formatMessage({ id: "blog:subtitle" })}
        >
          <ul className="list-inline blog-feature-meta">
            <li className="blog-date">
              {dateToDateTimeString(this.state.date)}
            </li>
            <li className="blog-province">
              {this.state.regions.map(region => (
                <Link key={region} to={"/blog?searchLang=all&region=" + region}>
                  {this.props.intl.formatMessage({ id: `region:${region}` })}
                </Link>
              ))}
            </li>
            <li className="blog-language">
              <Link to={"/blog?region=&searchLang=" + this.state.language}>
                {this.state.language.toUpperCase()}
              </Link>
            </li>
          </ul>
          <TagList tags={this.state.tags} />
        </PageHeadline>
        <section className="section-centered ">
          <section className="panel blog-post">{this.state.content}</section>
        </section>
        <SmShare />
      </>
    );
  }
}
export default injectIntl(withRouter(observer(BlogPost)));
