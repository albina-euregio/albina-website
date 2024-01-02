import { BloggerProcessor } from "./blogger";
import { WordpressProcessor } from "./wordpress";

export * from "./blogConfig";
export * from "./blogProcessor";
export * from "./blogPostPreviewItem";
export * from "./blogger";
export * from "./wordpress";

export const blogProcessors = Object.freeze({
  blogger: new BloggerProcessor(),
  wordpress: new WordpressProcessor()
});
