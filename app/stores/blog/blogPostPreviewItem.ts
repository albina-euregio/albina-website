import { parseTags } from "../../util/tagging";

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
    this.tags = parseTags(this.labels);
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
}
