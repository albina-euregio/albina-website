import type { BlogConfig, BlogProcessor, Category } from ".";
import { blogProcessors } from ".";
import { type BlogStore } from "../blogStore";
import { mappedCategoryName } from "./blogConfig";

const VALID_HOURS_DEFAULT = 72;
const VALID_HOURS = /valid_(?<hours>\d+)h/;
const BLOG_PROVIDER_TIMEOUT_MS = 8000;

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  context: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out after ${timeoutMs}ms (${context})`));
    }, timeoutMs);

    promise.then(
      value => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      error => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export class BlogPostPreviewItem {
  newUntil: number;

  constructor(
    public blogName: string,
    public postId: string,
    public url: string,
    public author: string,
    public date: Date,
    public title: string,
    public content: string,
    public lang: string,
    public langLinks: { lang: string; link: string }[] = [],
    public regions: string[] = [],
    public image: string = null,
    public categories: string[] = [],
    public tags: string[] = []
  ) {
    this.newUntil = BlogPostPreviewItem.getNewUntil(this.categories, this.date);
    this.categories = this.categories
      .filter(
        t => !VALID_HOURS.test(t) && !/Uncategorised|Uncategorized/.test(t)
      )
      .map(mappedCategoryName);
  }

  private static getNewUntil(
    labels: string[],
    published: string | number | Date
  ): number {
    const newUntil = new Date(published);
    const match = VALID_HOURS.exec(labels.join());
    const hours = match?.groups ? +match.groups["hours"] : VALID_HOURS_DEFAULT;
    return newUntil.setHours(newUntil.getHours() + hours);
  }

  static async loadBlogPost(
    blogName: string,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const config = [
      ...window.config.blogs,
      window.config.profilesBlog,
      window.config.techBlog
    ].find(e => e?.name === blogName);
    const processor: BlogProcessor = blogProcessors[config.apiType];
    const item = await processor.loadBlogPost(config, postId);
    return item;
  }

  static async loadBlogPosts(
    blogConfigs: BlogConfig[],
    state?: BlogStore
  ): Promise<(readonly [string, BlogPostPreviewItem[]])[]> {
    const providers = blogConfigs.filter(cfg => blogProcessors[cfg.apiType]);
    const loaded = await Promise.allSettled(
      providers.map(cfg =>
        withTimeout(
          (blogProcessors[cfg.apiType] as BlogProcessor).loadBlogPosts(
            cfg,
            state
          ),
          BLOG_PROVIDER_TIMEOUT_MS,
          `blog posts for ${cfg.name}`
        )
      )
    );

    return providers.map((cfg, index) => {
      const result = loaded[index];
      if (result.status === "fulfilled") {
        return [cfg.name, result.value] as const;
      }
      console.warn("Error while fetching blog posts", cfg, result.reason);
      return [cfg.name, [] as BlogPostPreviewItem[]] as const;
    });
  }

  static async loadCategories(
    blogConfigs: BlogConfig[]
  ): Promise<[string, Category[]][]> {
    const providers = blogConfigs.filter(cfg => cfg.apiType === "wordpress");
    const loaded = await Promise.allSettled(
      providers.map(cfg =>
        withTimeout(
          blogProcessors[cfg.apiType as "wordpress"].loadCategories(cfg),
          BLOG_PROVIDER_TIMEOUT_MS,
          `categories for ${cfg.name}`
        )
      )
    );

    return providers.map((cfg, index) => {
      const result = loaded[index];
      if (result.status === "fulfilled") {
        return [cfg.name, result.value] as [string, Category[]];
      }
      console.warn("Error while fetching blog categories", cfg, result.reason);
      return [cfg.name, []] as [string, Category[]];
    });
  }
}
