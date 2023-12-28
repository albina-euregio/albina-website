import React from "react";
import { observer } from "mobx-react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import LinkTreeFeature from "../components/organisms/linktree-feature";
import { newLegacyIntl } from "../i18n";

import { parseSearchParams } from "../util/searchParams";
import { dateToISODateString } from "../util/date.js";
import { BLOG_STORE } from "../stores/blogStore";

/*
 * Component to be used for pages with content delivered by CMS API.
 */
class LinkTree extends React.Component {
  constructor(props) {
    super(props);
    this.intl = newLegacyIntl();
    this.state = {
      title: "Linktree",
      subtitle: "subtitle",
      marginalText: "marginal",
      sharable: true,
      region: null,
      fd: false
    };
    this.regionParam = null;
    this.lastLang = null;
    this.onBulletinImageError = this.onBulletinImageError.bind(this);
  }

  componentDidMount() {
    this.checkRegion();
  }
  componentDidUpdate() {
    this.checkRegion();
  }

  checkRegion() {
    this.regionParam = parseSearchParams().get("region");
    const region = this.regionParam ? "?region=" + this.regionParam : "";
    if (region !== this.state.region) this.setState({ region });
  }

  getLanguage(dateString) {
    var lang = this.intl.locale.slice(0, 2);
    if (dateString < "2020-12-01") {
      switch (lang) {
        case "fr":
        case "es":
        case "ca":
        case "oc":
          return "en";
        default:
          return lang;
      }
    } else {
      return lang;
    }
  }

  onBulletinImageError() {
    if (this.state.fd === null) return;
    let fd = null;
    if (this.state.fd) fd = null;
    if (!this.state.fd) fd = true;
    this.setState({ fd });
  }

  render() {
    const dateString = dateToISODateString(new Date());
    const lang = this.getLanguage(dateString);

    if (lang !== this.lastLang) {
      this.lastLang = lang;
      BLOG_STORE.setLanguages(this.lastLang);
      BLOG_STORE.setRegions(this.regionParam);
      BLOG_STORE.update();
      //console.log("LinkTree->render xx101 new lang ", this.lastLang, this.regionParam);
    }

    let bulletinImageUrl = "https://lawinen.report/content_files/base-map.webp";

    const imgFormat = window.config.webp ? ".webp" : ".jpg";
    if (this.state.fd != null) {
      bulletinImageUrl = config.template(config.apis.bulletin.map, {
        date: dateString,
        publication: ".",
        file: this.state.fd ? "fd_EUREGIO_thumbnail" : "am_EUREGIO_thumbnail",
        format: imgFormat
      });
    }

    let blogImageUrl = "https://lawinen.report/content_files/base-map.webp";
    let blogUrl = this.intl.formatMessage({
      id: "more:linktree:blog:link"
    });
    let blogTitle = null;
    if (BLOG_STORE.postsList[0]) {
      const firstEntry = BLOG_STORE.postsList[0];
      blogImageUrl = firstEntry.image;
      blogUrl = "/blog/" + firstEntry.blogName + "/" + firstEntry.postId; //firstEntry.url;
      blogTitle = firstEntry.title;
    }

    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.intl.formatMessage({
            id: "more:linktree:title"
          })}
          subtitle={this.intl.formatMessage({
            id: "more:linktree:subtitle"
          })}
          marginal={this.intl.formatMessage({
            id: "more:linktree:marginal"
          })}
        />
        <section className="section-padding-height section-linktree-features">
          <div className="section-centered">
            <LinkTreeFeature
              url={"/bulletin" + this.state.region}
              image={{
                url: bulletinImageUrl,
                title: "the image",
                alt: "the alt",
                onError: this.onBulletinImageError
              }}
              title={this.intl.formatMessage({
                id: "more:linktree:bulletin:title"
              })}
            />

            <LinkTreeFeature
              url={blogUrl}
              external={true}
              image={{
                url: blogImageUrl,
                title: blogTitle,
                alt: blogTitle
              }}
              title={this.intl.formatMessage({
                id: "more:linktree:blog:title"
              })}
            />

            <LinkTreeFeature
              external={true}
              url={this.intl.formatMessage({
                id: "more:linktree:survey:link"
              })}
              image={{
                url: "https://lawinen.report/content_files/feature_community.jpg",
                title: "Survey",
                alt: "Survey Image"
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
export default observer(LinkTree);
