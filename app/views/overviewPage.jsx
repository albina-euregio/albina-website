import React from "react";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

/*
 * Compontent to be used for pages with content delivered by CMS API.
 */
export default class OverviewPage extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          {this.state.content}
        </section>
        <div className="clearfix"></div>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding"></div>
        )}
      </div>
    );
  }
}
