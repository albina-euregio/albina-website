import React from "react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import LinkTreeFeature from "../components/organisms/linktree-feature";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

import { scroll } from "../js/scroll";
/*
 * Component to be used for pages with content delivered by CMS API.
 */
class LinkTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Linktree",
      subtitle: "subtitle",
      marginalText: "marginal",
      sharable: false
    };
  }

  render() {
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "more:linktree:title"
          })}
          subtitle={this.props.intl.formatMessage({
            id: "more:linktree:subtitle"
          })}
          marginal={this.props.intl.formatMessage({
            id: "more:linktree:marginal"
          })}
        />
        <section className="section-padding-height section-linktree-features">
          <div className="section-centered">
            <LinkTreeFeature
              url={this.props.intl.formatMessage({
                id: "more:linktree:bulletin:link"
              })}
              image={{
                url: "https://source.unsplash.com/random",
                title: "the image",
                alt: "the alt"
              }}
              title={this.props.intl.formatMessage({
                id: "more:linktree:bulletin:title"
              })}
            />

            <LinkTreeFeature
              url={this.props.intl.formatMessage({
                id: "more:linktree:blog:link"
              })}
              image={{
                url: "https://source.unsplash.com/random",
                title: "the image",
                alt: "the alt"
              }}
              title={this.props.intl.formatMessage({
                id: "more:linktree:blog:title"
              })}
            />

            <LinkTreeFeature
              external={true}
              url={this.props.intl.formatMessage({
                id: "more:linktree:survey:link"
              })}
              image={{
                url: "https://source.unsplash.com/random",
                title: "the image",
                alt: "the alt"
              }}
              title="Survey"
            />
          </div>
        </section>
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
export default injectIntl(LinkTree);
