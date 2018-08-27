import React from 'react';
import { Link } from 'react-router-dom';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import PageHeadline from '../components/organisms/page-headline';
import SmShare from '../components/organisms/sm-share';

/*
 * Compontent to be used for pages with content delivered by CMS API.
 */
export default class StaticPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      headerText: '',
      content: '',
      sharable: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }

  componentDidMount() {
    this._fetchData(this.props);
  }

  _fetchData(props) {
    // remove projectRoot from the URL
    const site = props.location.pathname.substr(config.get('projectRoot')).replace(/^\//, '');

    // TODO: use subqueries to eleiminate the need of an additional API roundtrip: https://www.drupal.org/project/subrequests
    if(site) {
      window['staticPageStore'].loadPage(site).then((response) => {
        // parse content
        const responseParsed = JSON.parse(response);
        this.setState({
          title: responseParsed.data.attributes.title,
          headerText: responseParsed.data.attributes.header_text,
          content: this._preprocessContent(responseParsed.data.attributes.body),
          sharable: responseParsed.data.attributes.sharable
        });
      });
    }
  }

  _preprocessContent(content) {
    const defaults = new ProcessNodeDefinitions(React);
    const htmlParser = new Parser();
    const isValidNode = () => true;

    const matches = config.get('apis.content').match(/^(https?:)?\/\/([^/]+)/);
    let cmsHost = '';
    if(matches && matches.length == 3) {
      const proto = matches[1] ? matches[1] : window.location.protocol;
      const host = matches[2];
      cmsHost = proto + '//' + host;
    }

    const instructions = [
      {
        // Replace internal links by Link
        shouldProcessNode: (node) => {
          return (node.name == 'a' && node.attribs.href.match(/^\/[^/]+/));
        },
        processNode: (node, ...args) => {
          return React.createElement(
            Link,
            {to: node.attribs.href},
            ...args[0]
          );
        }
      },
      {
        // Fix image paths for CMS-relative URLs
        shouldProcessNode: (node) => {
          return (node.name == 'img' && node.attribs.src.match(/^\//));
        },
        processNode: (node, ...args) => {
          node.attribs.src = cmsHost + node.attribs.src;
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

  render() {
    return (
      <div>
        <PageHeadline title={this.state.title} marginal={this.state.headerText} />
        <section className="section-centered">
          {
            this.state.content
          }
        </section>
        { this.state.sharable ?
          <SmShare /> : <div className="section-padding"></div>
        }
      </div>
    );
  }
}
