import React from "react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { preprocessContent } from "../util/htmlParser";
import { capitalizeFirstLetter } from "../util/strings";
import { video_init } from "../js/video";
import { injectIntl } from "react-intl";

import { scroll } from "../js/scroll";
/*
 * Component to be used for pages with content delivered by CMS API.
 */
class StaticPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      chapter: "",
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
          chapter: responseParsed.data.attributes.chapter
            ? this.props.intl.formatMessage({
                id:
                  responseParsed.data.attributes.chapter + ":subpages:subtitle"
              })
            : "",
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
          subtitle={this.state.chapter}
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

export default injectIntl(StaticPage);
