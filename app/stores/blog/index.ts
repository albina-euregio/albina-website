import { AlbinaProcessor } from "./albinaBlog";
import { BloggerProcessor } from "./blogger";
import { WordpressProcessor } from "./wordpress";

export * from "./blogConfig";
export * from "./blogProcessor";
export * from "./blogPostPreviewItem";
export * from "./albinaBlog";
export * from "./blogger";
export * from "./wordpress";

export const blogProcessors = Object.freeze({
  albina: new AlbinaProcessor(),
  blogger: new BloggerProcessor(),
  wordpress: new WordpressProcessor()
});
