import type * as v from "valibot";
import type {
  vBlogItem,
  vGetBlogPostQuery,
  vGetBlogPostsQuery
} from "../../api/valibot.gen";
import type { Language } from "../../appStore";
import { fetchJSON } from "../../util/fetch";
import type { BlogStore } from "../blogStore";
import type { BlogConfig } from "./blogConfig";
import { BlogPostPreviewItem } from "./blogPostPreviewItem";
import type { BlogProcessor } from "./blogProcessor";

type BlogItem = v.InferOutput<typeof vBlogItem>;
type GetBlogPostsQuery = Partial<v.InferInput<typeof vGetBlogPostsQuery>>;
type GetBlogPostQuery = v.InferInput<typeof vGetBlogPostQuery>;

function newSearchParams(query: Record<string, string | undefined>) {
  return new URLSearchParams(
    Object.entries(query).filter(([, value]) => !!value) as [string, string][]
  );
}

export class AlbinaProcessor implements BlogProcessor {
  async loadBlogPosts(
    config: BlogConfig,
    state?: BlogStore
  ): Promise<BlogPostPreviewItem[]> {
    const params = newSearchParams({
      region: config.regions[0],
      lang: config.lang as Language,
      searchText: state?.searchText,
      startDate: state?.year ? state.startDate.toString() : undefined,
      endDate: state?.year ? state.endDate.toString() : undefined
    } satisfies GetBlogPostsQuery);
    const items = await fetchJSON<BlogItem[]>(
      `${window.config.apis.blogs}/posts?${params}`,
      {}
    );
    const posts = items.map(item => this.newItem(item, config));
    // searchCategory expects WordPress term IDs, which no endpoint exposes
    const category = state?.searchCategoryName;
    return category
      ? posts.filter(post => post.categories.includes(category))
      : posts;
  }

  async loadBlogPost(
    config: BlogConfig,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const params = newSearchParams({
      region: config.regions[0],
      lang: config.lang as Language,
      id: String(postId)
    } satisfies GetBlogPostQuery);
    const item = await fetchJSON<BlogItem>(
      `${window.config.apis.blogs}/post?${params}`,
      {}
    );
    return this.newItem(item, config);
  }

  private newItem(item: BlogItem, config: BlogConfig): BlogPostPreviewItem {
    return new BlogPostPreviewItem(
      config.name,
      item.id,
      `https://${config.params.id}/?p=${item.id}`,
      "",
      new Date(item.published),
      item.title,
      item.content,
      config.lang,
      this.langLinks(item, config),
      config.regions,
      item.attachmentUrl,
      item.categories
    );
  }

  private langLinks(
    item: BlogItem,
    config: BlogConfig
  ): { lang: string; link: string }[] {
    const blogNames = new Set(window.config.blogs.map(blog => blog.name));
    return Object.entries(item.translations)
      .filter(([lang, postId]) => !!postId && lang !== config.lang)
      .map(([lang, postId]) => ({
        lang,
        // blogs are named `<region>-<lang>`, e.g. at-07-de, at-07-en, at-07-it
        blogName: config.name.replace(
          new RegExp(`-${config.lang}$`),
          `-${lang}`
        ),
        postId
      }))
      .filter(({ blogName }) => blogNames.has(blogName))
      .map(({ lang, blogName, postId }) => ({
        lang,
        link: `/blog/${blogName}/${postId}`
      }));
  }
}
