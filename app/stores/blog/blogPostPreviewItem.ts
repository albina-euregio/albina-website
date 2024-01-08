import { BlogProcessor, blogProcessors } from ".";
import type { Language } from "../../appStore";
import { avalancheProblems } from "../../util/avalancheProblems";
import type { RegionCodes } from "../../util/regions";
import type BlogStore from "../blogStore";

export class BlogPostPreviewItem {
  tags: string[];
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
    public labels: string[] = []
  ) {
    this.tags = Array.isArray(this.labels)
      ? this.labels.filter(l => avalancheProblems.includes(l))
      : [];
    this.newUntil = BlogPostPreviewItem.getNewUntil(this.labels, this.date);
  }

  private static getNewUntil(
    labels: string | string[],
    published: string | number | Date
  ): number {
    const newUntil = new Date(published);
    //newUntil.setMonth(newUntil.getMonth() + 12);
    if (labels.includes("valid_72h"))
      return newUntil.setHours(newUntil.getHours() + 72);
    if (labels.includes("valid_48h"))
      return newUntil.setHours(newUntil.getHours() + 48);
    return newUntil.setHours(newUntil.getHours() + 24);
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
      config.blogs
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
