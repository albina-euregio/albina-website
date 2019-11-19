import React from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import Base from "./../base";
import PageHeadline from "../components/organisms/page-headline";
import HTMLHeader from "../components/organisms/html-header";
import TagList from "../components/blog/tag-list";
import { parseDate, dateToDateString } from "../util/date";
import { parseTags } from "../util/tagging";
import { modal_init } from "../js/modal";
import { video_init } from "../js/video";
import axios from "axios";

export default class BlogPost extends React.Component {
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

    const blogConfig = window["config"].get("blogs").find(e => {
      return e.name === blogName;
    });
    if (blogConfig && postId) {
      const params = {
        key: window["config"].get("apiKeys.google")
      };
      const url =
        window["config"].get("apis.blogger") +
        blogConfig.params.id +
        "/posts/" +
        postId;

      axios
        .get(url, params)
        .then(response => {
          const b = response.data;

          this.setState({
            title: b.title,
            //author: b.author.displayName,
            date: parseDate(b.published),
            tags: parseTags(b.labels),
            regions: blogConfig.regions.map(r =>
              window["appStore"].getRegionName(r)
            ),
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
      <div>
        <HTMLHeader title={this.state.title} />
        <PageHeadline title={this.state.title} subtitle="Blog">
          <ul className="list-inline blog-feature-meta">
            <li className="blog-date">{dateToDateString(this.state.date)}</li>
            <li className="blog-province">{this.state.regions.join(", ")}</li>
            <li className="blog-language">
              {this.state.language.toUpperCase()}
            </li>
          </ul>
          <TagList tags={this.state.tags} />
        </PageHeadline>
        <section className="section-centered ">
          <section className="panel blog-post">{this.state.content}</section>
        </section>
      </div>
    );
  }
}
