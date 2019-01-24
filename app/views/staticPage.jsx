import React from "react";
import { ProcessNodeDefinitions } from "html-to-react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import { preprocessContent } from "../util/htmlParser";

import { scroll_init, scroll } from "../js/scroll";
/*
 * Compontent to be used for pages with content delivered by CMS API.
 */
export default class StaticPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      headerText: "",
      content: "",
      sharable: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }

  componentDidMount() {
    this._fetchData(this.props);
  }

  componentDidUpdate() {
    if (this.props.location.hash) {
      scroll(this.props.location.hash, 2000);
    }
  }

  _fetchData(props) {
    // remove projectRoot from the URL
    const site = props.location.pathname
      .substr(config.get("projectRoot"))
      .replace(/^\//, "");

    // TODO: use subqueries to eleiminate the need of an additional API roundtrip: https://www.drupal.org/project/subrequests
    if (site) {
      window["staticPageStore"].loadPage(site).then(response => {
        // parse content
        const responseParsed = JSON.parse(response);
        this.setState({
          title: responseParsed.data.attributes.title,
          headerText: responseParsed.data.attributes.header_text,
          content: preprocessContent(responseParsed.data.attributes.body),
          sharable: responseParsed.data.attributes.sharable
        });
      });
    }
  }

  render() {
    return (
      <div>
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section-centered">{this.state.content}</section>
        <div className="clearfix" />
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </div>
    );
  }
}
