import { BlogProcessor, blogProcessors } from ".";
import type { Language } from "../../appStore";
import type { RegionCodes } from "../../util/regions";
import type { BlogStore } from "../blogStore";

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
    const hours = match?.groups ? +match.groups["hours"] : 24;
    return newUntil.setHours(newUntil.getHours() + hours);
  }

  static async loadBlogPost(
    blogName: string,
    postId: unknown
  ): Promise<BlogPostPreviewItem> {
    const config = window.config.blogs.find(e => e.name === blogName);
    const processor: BlogProcessor = blogProcessors[config.apiType];
    const item = await processor.loadBlogPost(config, postId);
    return item;
  }

  static async loadBlogPosts(
    languagePredicate: (lang: Language) => boolean,
    regionPredicate: (region: RegionCodes) => boolean,
    state?: BlogStore
  ): Promise<(readonly [string, BlogPostPreviewItem[]])[]> {
    return await Promise.all(
      window.config.blogs
        .filter(cfg => languagePredicate(cfg.lang))
        .filter(cfg => cfg.regions.some(region => regionPredicate(region)))
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
}
