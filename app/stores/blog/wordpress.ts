import { BlogConfig, BlogPostPreviewItem, BlogProcessor } from ".";
import type { BlogStore } from "../blogStore";
import { fetchJSON } from "../../util/fetch";
import { parseDate } from "../../util/date";

export class WordpressProcessor implements BlogProcessor {
  async loadCategories(config: BlogConfig): Promise<Category[]> {
    // https://developer.wordpress.org/rest-api/reference/categories/#arguments
    const params = new URLSearchParams({
      lang: config.lang, // via parse_query_polylang
      _fields: (
        [
          "id",
          "count",
          "description",
          "name",
          "slug",
          "taxonomy",
          "polylang_current_lang",
          "polylang_translations"
        ] satisfies (keyof Category)[]
      ).join(),
      per_page: String(99)
    });
    return await fetchJSON<Category[]>(
      `https://${config.params.id}/wp-json/wp/v2/categories?${params}`,
      {}
    );
  }

  async loadBlogPosts(
    config: BlogConfig,
    state?: BlogStore
  ): Promise<BlogPostPreviewItem[]> {
    // https://developer.wordpress.org/rest-api/reference/posts/#arguments
    // https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_embed
    const params = new URLSearchParams({
      lang: config.lang, // via parse_query_polylang
      _embed: "wp:term",
      _fields: (
        [
          "_links",
          "_embedded",
          "categories",
          "date",
          "featured_image_url",
          "featured_media",
          "id",
          "link",
          "polylang_current_lang",
          "polylang_translations",
          "tags",
          "title"
        ] satisfies (keyof Post | "_links" | "_embedded")[]
      ).join(),
      per_page: String(99)
    });
    if (state?.searchText) {
      params.set("search", state.searchText);
    }
    if (state?.searchCategory) {
      params.set("categories", state.searchCategory);
    }
    if (state?.year) {
      params.set("after", state.startDate.toISOString());
      params.set("before", state.endDate.toISOString());
    }
    const posts: Post[] = await fetchJSON(
      `https://${config.params.id}/wp-json/wp/v2/posts?${params}`,
      {}
    );
    return posts.map(post => this.newItem(post, config)).filter(item => !!item);
  }

  async loadBlogPost(
    config: BlogConfig,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const params = new URLSearchParams({
      _embed: "wp:term"
    });
    const post: Post = await fetchJSON(
      `https://${config.params.id}/wp-json/wp/v2/posts/${postId}?${params}`,
      {}
    );
    return this.newItem(post, config);
  }

  private newItem(post: Post, config: BlogConfig) {
    if (config.lang !== this.parseLang(post.polylang_current_lang)) {
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
      (post.polylang_translations || [])
        .map(t => ({
          lang: this.parseLang(t.locale),
          link: `/blog/${config.name.replace(
            new RegExp(`-${config.lang}$`),
            `-${this.parseLang(t.locale)}`
          )}/${t.id}`
        }))
        .filter(({ lang }) => config.lang !== lang),
      config.regions,
      post.featured_image_url,
      post._embedded["wp:term"].flat().map(t => t.name)
    );
  }

  private parseLang(lang: PolylangCurrentLang) {
    return lang?.slice(0, 2);
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
  polylang_current_lang: PolylangCurrentLang; // via register_rest_polylang
  polylang_translations: PolylangTranslation[]; // via register_rest_polylang
  featured_image_url: string; // via register_rest_images
  _embedded: Embedded;
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

export interface Category {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  taxonomy: Taxonomy;
  polylang_current_lang: PolylangCurrentLang;
  polylang_translations: PolylangTranslation[];
}

export interface Embedded {
  "wp:term": EmbeddedWpTerm[][];
}

export interface EmbeddedWpTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: Taxonomy;
  _links: unknown;
}

type Taxonomy = "category" | "post_tag";
