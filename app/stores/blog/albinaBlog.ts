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
      searchCategory: state?.searchCategory?.[config.name],
      startDate: state?.year ? state.startDate.toString() : undefined,
      endDate: state?.year ? state.endDate.toString() : undefined
    } satisfies GetBlogPostsQuery);
    const items = await fetchJSON<BlogItem[]>(
      `${window.config.apis.blogs}/posts?${params}`,
      {}
    );
    return items.map(item => this.newItem(item, config));
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
      "",
      "",
      new Date(item.published),
      item.title,
      item.content,
      config.lang,
      [],
      config.regions,
      item.attachmentUrl,
      item.categories
    );
  }
}
