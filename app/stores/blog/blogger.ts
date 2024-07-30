import { BlogProcessor, BlogConfig, BlogPostPreviewItem } from ".";
import type { BlogStore } from "../blogStore";
import { fetchJSON } from "../../util/fetch";
import { parseDate } from "../../util/date";

type BloggerItem = {
  kind: string;
  id: string;
  content?: string;
  blog: {
    id: string;
  };
  published: Date;
  updated: Date;
  url: string;
  selfLink: string;
  title: string;
  images?: {
    url: string;
  }[];
  author: {
    id: string;
    displayName: string;
    url: string;
    image: {
      url: string;
    };
  };
  labels?: string[];
  etag: string;
};

export class BloggerProcessor implements BlogProcessor {
  async loadBlogPosts(
    config: BlogConfig,
    state?: BlogStore
  ): Promise<BlogPostPreviewItem[]> {
    let baseUrl = window.config.apis.blogger + config.params.id + "/posts";
    const params = new URLSearchParams({
      maxResults: String(500),
      fetchBodies: String(false),
      fetchImages: String(true),
      status: "live",
      key: window.config.apiKeys.google
    });
    if (state?.searchText) {
      params.set("q", state.searchText);
      baseUrl += "/search";
    } else {
      if (state?.problem && state?.problem !== "all") {
        params.set("labels", state.problem);
      }
      if (state?.year) {
        params.set("startDate", state.startDate.toISOString());
        params.set("endDate", state.endDate.toISOString());
      }
    }
    const url = baseUrl + "?" + params;

    const response = await fetchJSON<{ items: BloggerItem[] }>(url, {
      headers: { Accept: "application/json" }
    });
    if (Array.isArray(response.items)) {
      return (response.items as BloggerItem[]).map(item =>
        this.newItem(item, config)
      );
    }
    return [];
  }

  async loadBlogPost(
    config: BlogConfig,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const url =
      window.config.apis.blogger +
      config.params.id +
      "/posts/" +
      postId +
      "?key=" +
      encodeURIComponent(window.config.apiKeys.google);
    const item = await fetchJSON<BloggerItem>(url, {});
    return this.newItem(item, config);
  }

  private newItem(item: BloggerItem, config: BlogConfig) {
    const previewImage =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0].url
        : null;

    return new BlogPostPreviewItem(
      config.name,
      item.id,
      item.url,
      item.author.displayName,
      parseDate(item.published),
      item.title,
      item.content,
      config.lang,
      [],
      config.regions,
      previewImage,
      item.labels || []
    );
  }
}
