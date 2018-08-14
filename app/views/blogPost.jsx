import React from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import Base from './../base';
import PageHeadline from '../components/organisms/page-headline';
import { parseDate, dateToDateString } from '../util/date';
import { modal_init } from '../js/modal';

export default class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      autor: '',
      date: '',
      tags: [],
      regions: [],
      language: '',
      content: ''
    }
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
    const deprecatedAttrs = ['align', 'border'];

    const instructions = [
      {
        // Remove deprecated html attributes
        shouldProcessNode: (node) => {
          return node.attribs && deprecatedAttrs.reduce((acc, prop) => acc || node.attribs[prop], false);
        },
        processNode: (node, ...args) => {
          deprecatedAttrs.forEach((prop) => {
            if(node.attribs[prop]) {
              delete node.attribs[prop];
            }
          });
          return defaults.processDefaultNode(node, ...args);
        }
      },
      {
        // Turn images into
        shouldProcessNode: (node) => {
          return (node.name == 'a')
            && node.children
            && node.children.reduce((acc, c) => acc || (c.name == 'img'), false);
        },
        processNode: (node, ...args) => {
          node.attribs.class = (node.attribs.class ? (node.attribs.class + ' ') : '')
            + 'mfp-image modal-trigger img';
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

    const blogConfig = window['config'].get('blogs').find((e) => { return e.name === blogName; });
    if(blogConfig && postId) {
      const params = {
        key: window['config'].get('apiKeys.google')
      };
      const url = window['config'].get('apis.blogger') + blogConfig.params.id + '/posts/' + postId;
      Base.doRequest(Base.makeUrl(url, params)).then((response) => {
        const b = JSON.parse(response);

        this.setState({
          title: b.title,
          author: b.author.displayName,
          date: parseDate(b.published),
          tags: Array.isArray(b.labels) ? b.labels : [],
          regions: blogConfig.regions.map((r) => window['appStore'].getRegionName(r)),
          language: blogConfig.lang,
          content: this._preprocessContent(b.content)
        })
      }).then(() => {
        window.setTimeout(() => {
          modal_init();
        }, 1000);
      });
    }
  }

  render() {
    return (
      <div>
        <PageHeadline title={this.state.title} subtitle="Blog">
          <ul className="list-inline blog-feature-meta">
            <li className="blog-author">{this.state.author}</li>
            <li className="blog-date">{dateToDateString(this.state.date)}</li>
            <li className="blog-province">{this.state.regions.join(', ')}</li>
            <li className="blog-language">{this.state.language.toUpperCase()}</li>
          </ul>
          { (this.state.tags && this.state.tags.length > 0) &&
            <ul className="list-inline blog-list-labels">
              {this.state.tags.map((l, i) => {
                <li key={i}><span className="label">{l}</span></li>
              })}
            </ul>
          }
        </PageHeadline>
        <section className="section-centered">
          {this.state.content}
        </section>
      </div>
    );
  }
}
