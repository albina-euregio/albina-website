import type { BlogConfig, BlogProcessor, Category } from ".";
import { blogProcessors } from ".";
import type { BlogStore } from "../blogStore";

const VALID_HOURS_DEFAULT = 72;
const VALID_HOURS = /valid_(?<hours>\d+)h/;

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
    public tags: string[] = []
  ) {
    this.newUntil = BlogPostPreviewItem.getNewUntil(this.tags, this.date);
    this.tags = this.tags.filter(
      t => !VALID_HOURS.test(t) && !/Uncategorised|Uncategorized/.test(t)
    );
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
    const config = [...window.config.blogs, window.config.techBlog].find(
      e => e.name === blogName
    );
    const processor: BlogProcessor = blogProcessors[config.apiType];
    const item = await processor.loadBlogPost(config, postId);
    return item;
  }

  static async loadBlogPosts(
    blogConfigs: BlogConfig[],
    state?: BlogStore
  ): Promise<(readonly [string, BlogPostPreviewItem[]])[]> {
    return await Promise.all(
      blogConfigs
        .filter(cfg => blogProcessors[cfg.apiType])
        .map(cfg =>
          (blogProcessors[cfg.apiType] as BlogProcessor)
            .loadBlogPosts(cfg, state)
            .then(posts => [cfg.name, posts] as const)
            .catch(error => {
              console.warn("Error while fetching blog posts", cfg, error);
              return [cfg.name, [] as BlogPostPreviewItem[]] as const;
            })
        )
    );
  }

  static async loadCategories(
    blogConfigs: BlogConfig[]
  ): Promise<[string, Category[]][]> {
    return await Promise.all(
      blogConfigs
        .filter(cfg => cfg.apiType === "wordpress")
        .map(cfg =>
          blogProcessors[cfg.apiType as "wordpress"]
            .loadCategories(cfg)
            .then(categories => [cfg.name, categories] as [string, Category[]])
            .catch(error => {
              console.warn("Error while fetching blog categories", cfg, error);
              return [cfg.name, []] as [string, Category[]];
            })
        )
    );
  }
}
