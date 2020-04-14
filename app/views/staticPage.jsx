import React from "react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { video_init } from "../js/video";

import { scroll } from "../js/scroll";
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

  componentDidUpdate() {
    if (this.props.location.hash) {
      scroll(this.props.location.hash, 2000);
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
