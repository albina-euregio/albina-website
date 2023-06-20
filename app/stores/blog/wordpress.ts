import { BlogConfig, BlogPostPreviewItem, BlogProcessor } from ".";
import type BlogStore from "../blogStore";
import { fetchJSON } from "../../util/fetch";
import { parseDate } from "../../util/date";

export class WordpressProcessor implements BlogProcessor {
  async loadBlogPosts(
    config: BlogConfig,
    state: BlogStore
  ): Promise<BlogPostPreviewItem[]> {
    // https://developer.wordpress.org/rest-api/reference/categories/#arguments
    const allCategories: Category[] = await fetchJSON(
      `https://${
        config.params.id
      }/wp-json/wp/v2/categories?${new URLSearchParams({
        per_page: String(100)
      })}`,
      {}
    );
    // https://developer.wordpress.org/rest-api/reference/posts/#arguments
    const params = new URLSearchParams({
      _fields:
        "categories,date,featured_image_url,featured_media,id,link,polylang_current_lang,title",
      per_page: String(100)
    });
    if (state.searchText) {
      params.set("search", state.searchText);
    }
    if (state.year) {
      params.set("after", state.startDate.toISOString());
      params.set("before", state.endDate.toISOString());
    }
    const posts: Post[] = await fetchJSON(
      `https://${config.params.id}/wp-json/wp/v2/posts?${params}`,
      {}
    );
    return posts
      .map(post => {
        const categories = post.categories
          ?.map(c => allCategories.find(({ id }) => c === id))
          .map(c => c.name);
        return this.newItem(post, categories, config);
      })
      .filter(item => !!item);
  }

  async loadBlogPost(
    config: BlogConfig,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const post: Post = await fetchJSON(
      `https://${config.params.id}/wp-json/wp/v2/posts/${postId}`,
      {}
    );
    return this.newItem(post, [], config);
  }

  private newItem(post: Post, categories: string[], config: BlogConfig) {
    if (config.lang !== post.polylang_current_lang?.slice(0, 2)) {
      return undefined;
    }
    return new BlogPostPreviewItem(
      config.name,
      String(post.id),
      post.link,
      "",
      parseDate(post.date),
      WordpressProcessor.decodeHtmlEntities(post.title?.rendered),
      post.content?.rendered,
      config.lang,
      config.regions,
      post.featured_image_url,
      categories
    );
  }

  private static decodeHtmlEntities(str: string) {
    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  }
}
interface Post {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Content;
  content: Content;
  excerpt: Content;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  polylang_current_lang: PolylangCurrentLang;
  polylang_translations: PolylangTranslation[];
  featured_image_url: string;
}

enum PolylangCurrentLang {
  DeAT = "de_AT",
  EnGB = "en_GB",
  ItIT = "it_IT"
}

interface PolylangTranslation {
  locale: PolylangCurrentLang;
  id: number;
}

interface Content {
  rendered: string;
  protected: boolean;
}

interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}
