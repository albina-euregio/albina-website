import React from "react";
import { Link } from "react-router-dom";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
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
import axios from "axios";

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
    const defaults = new ProcessNodeDefinitions(React);
    const htmlParser = new Parser();
    const isValidNode = () => true;
    const deprecatedAttrs = ["align", "border"];

    const instructions = [
      {
        // Turn image links into lightboxes
        shouldProcessNode: node => {
          return (
            node.name == "a" &&
            node.children &&
            node.children.reduce((acc, c) => acc || c.name == "img", false)
          );
        },
        processNode: (node, ...args) => {
          node.attribs.class =
            (node.attribs.class ? node.attribs.class + " " : "") +
            "mfp-image modal-trigger img";
          return defaults.processDefaultNode(node, ...args);
        }
      },
      {
        // Use Fitvids for youtube iframes
        shouldProcessNode: node => {
          return (
            node.name == "iframe" &&
            node.attribs.class &&
            node.attribs.class.indexOf("YOUTUBE-iframe-video") >= 0
          );
        },
        processNode: (node, ...args) => {
          return React.createElement(
            "div",
            { className: "fitvids", key: node.attribs.src },
            defaults.processDefaultNode(node, ...args)
          );
        }
      },
      {
        // Remove deprecated html attributes
        shouldProcessNode: node => {
          return (
            node.attribs &&
            deprecatedAttrs.reduce(
              (acc, prop) => acc || node.attribs[prop],
              false
            )
          );
        },
        processNode: (node, ...args) => {
          deprecatedAttrs.forEach(prop => {
            if (node.attribs[prop]) {
              delete node.attribs[prop];
            }
          });
          return defaults.processDefaultNode(node, ...args);
        }
      },
      {
        shouldProcessNode: () => true,
        processNode: defaults.processDefaultNode
      }
    ];

    return htmlParser.parseWithInstructions(content, isValidNode, instructions);
  }

  _fetchData(props) {
    const blogName = props.match.params.blogName;
    const postId = props.match.params.postId;

    const blogConfig = window.config.blogs.find(e => {
      return e.name === blogName;
    });
    if (blogConfig && postId) {
      const params = {
        key: window.config.apiKeys.google
      };
      const url =
        window.config.apis.blogger + blogConfig.params.id + "/posts/" + postId;

      axios
        .get(url, { params })
        .then(response => {
          const b = response.data;

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
