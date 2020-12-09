import React from "react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { video_init } from "../js/video";

import { scroll } from "../js/scroll";
/*
 * Component to be used for pages with content delivered by CMS API.
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

  componentDidUpdate(prevProps) {
    if (this.props?.location?.pathname !== prevProps?.location?.pathname) {
      this._fetchData();
    }
    if (this.props.location.hash) {
      scroll(this.props.location.hash, 2000);
    }
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    // remove projectRoot from the URL
    const site = this.props.location.pathname
      .substr(config.projectRoot)
      .replace(/^\//, "");

    if (site) {
      window["staticPageStore"].loadPage(site).then(responseParsed => {
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
    if (this.state.content != "") video_init();
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        {/* <section className="section-centered">{this.state.content}</section> */}
        {this.state.content}
        <div className="clearfix" />
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </>
    );
  }
}
