import React from "react";
import { Temporal } from "temporal-polyfill";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import LinkTreeFeature from "../components/organisms/linktree-feature";
import { FormattedMessage } from "../i18n";
import * as BLOG_STORE from "../stores/blogStore";

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
  }

  componentDidMount() {
    this.checkRegion();
  }
  componentDidUpdate() {
    this.checkRegion();
  }

  checkRegion() {
    this.regionParam = new URL(document.location.href).searchParams.get(
      "region"
    );
    const region = this.regionParam ? "?region=" + this.regionParam : "";
    if (region !== this.state.region) this.setState({ region });
  }

  onBulletinImageError() {
    if (this.state.fd === null) return;
    let fd = null;
    if (this.state.fd) fd = null;
    if (!this.state.fd) fd = true;
    this.setState({ fd });
  }

  render() {
    const date = Temporal.Now.plainDateISO();
    const lang = document.body.parentElement.lang;

    if (lang !== this.lastLang) {
      this.lastLang = lang;
      BLOG_STORE.language.set(this.lastLang);
      BLOG_STORE.region.set(this.regionParam);
      BLOG_STORE.load();
      //console.log("LinkTree->render xx101 new lang ", this.lastLang, this.regionParam);
    }

    let bulletinImageUrl = "https://lawinen.report/content_files/base-map.webp";

    if (this.state.fd != null) {
      bulletinImageUrl = config.template(config.apis.bulletin.map, {
        date,
        publication: ".",
        file: this.state.fd ? "fd_EUREGIO_thumbnail" : "am_EUREGIO_thumbnail"
      });
    }

    let blogImageUrl = "https://lawinen.report/content_files/base-map.webp";
    let blogUrl = <FormattedMessage id="more:linktree:blog:link" />;
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
          title={<FormattedMessage id="more:linktree:title" />}
          subtitle={<FormattedMessage id="more:linktree:subtitle" />}
          marginal={<FormattedMessage id="more:linktree:marginal" />}
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
              title={<FormattedMessage id="more:linktree:bulletin:title" />}
            />

            <LinkTreeFeature
              url={blogUrl}
              external={true}
              image={{
                url: blogImageUrl,
                title: blogTitle,
                alt: blogTitle
              }}
              title={<FormattedMessage id="more:linktree:blog:title" />}
            />

            <LinkTreeFeature
              external={true}
              url={<FormattedMessage id="more:linktree:survey:link" />}
              image={{
                url: "https://lawinen.report/content_files/feature_community.webp",
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
export default LinkTree;
