import React from "react";
import { observer } from "mobx-react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import LinkTreeFeature from "../components/organisms/linktree-feature";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { parseSearchParams } from "../util/searchParams";
import { dateToISODateString } from "../util/date.js";
import BlogStore from "../stores/blogStore";

//import { scroll } from "../js/scroll";
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
      sharable: true,
      region: null,
      fd: false
    };
    this.regionParam = null;
    this.lastLang = null;
    this.onBulletinImageError = this.onBulletinImageError.bind(this);

    const getHistory = () => this.props.history;
    if (!window["blogStore"]) {
      window["blogStore"] = new BlogStore(getHistory);
    }

    /**
     * @type {BlogStore}
     */
    this.store = window["blogStore"];
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
    var lang = window["appStore"].language;
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
      this.store.setLanguages(this.lastLang);
      this.store.setRegions(this.regionParam);
      this.store.update();
      //console.log("LinkTree->render xx101 new lang ", this.lastLang, this.regionParam);
    }

    let bulletinImageUrl = "https://lawinen.report/content_files/base-map.webp";

    const imgFormat = window.config.webp ? ".webp" : ".jpg";
    if (this.state.fd != null) {
      bulletinImageUrl =
        window.config.apis.geo +
        dateString +
        "/" +
        (this.state.fd ? "fd_albina_thumbnail" : "am_albina_thumbnail") +
        imgFormat;
    }

    let blogImageUrl = "https://lawinen.report/content_files/base-map.webp";
    let blogUrl = this.props.intl.formatMessage({
      id: "more:linktree:blog:link"
    });
    let blogTitle = null;
    if (this.store.postsList[0]) {
      const firstEntry = this.store.postsList[0];
      blogImageUrl = firstEntry.image;
      blogUrl = "/blog/" + firstEntry.blogName + "/" + firstEntry.postId; //firstEntry.url;
      blogTitle = firstEntry.title;

      // console.log(
      //   "LinkTree->render xx101",
      //   firstEntry.image,
      //   blogImageUrl,
      //   this.store.postsList[0]
      // );
    }

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
              url={"/bulletin" + this.state.region}
              image={{
                url: bulletinImageUrl,
                title: "the image",
                alt: "the alt",
                onError: this.onBulletinImageError
              }}
              title={this.props.intl.formatMessage({
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
export default injectIntl(withRouter(observer(LinkTree)));
