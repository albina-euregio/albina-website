import { fetchText } from "../util/fetch";

export default class StaticPageStore {
  static async loadPage(url) {
    const lang = document.body.parentElement.lang;
    const chapter = url.split("/")[0] || "";
    url = `${import.meta.env.BASE_URL}content/${url}/${lang}.html`;

    const text = await fetchText(url);
    const sharable = true;
    // extract title from first <h1>...</h1>
    const titlePattern = /<h1>\s*(.*?)\s*<\/h1>/;
    const title = text.match(titlePattern)?.[1];
    const body = text.replace(titlePattern, "");
    return {
      data: {
        attributes: { title, chapter, body, sharable }
      }
    };
  }
}
