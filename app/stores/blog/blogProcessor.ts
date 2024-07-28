import type { BlogConfig, BlogPostPreviewItem } from ".";
import type { BlogStore } from "../blogStore";

export interface BlogProcessor {
  loadCategories: (
    config: BlogConfig
  ) => Promise<{ name: string; id: string }[]>;
  loadBlogPosts: (
    config: BlogConfig,
    state?: BlogStore
  ) => Promise<BlogPostPreviewItem[]>;
  loadBlogPost: (
    config: BlogConfig,
    postId: unknown
  ) => Promise<BlogPostPreviewItem>;
}
