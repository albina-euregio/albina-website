import { fetchText } from "../util/fetch";

export default class StaticPageStore {
  async loadPage(url) {
    const lang = window["appStore"].language;
    url = `${APP_ASSET_PATH}content/${url}/${lang}.html`;
    const text = await fetchText(url);
    const sharable = true;
    // extract title from first <h1>...</h1>
    const titlePattern = /<h1>\s*(.*?)\s*<\/h1>/;
    const title = text.match(titlePattern)?.[1];
    const body = text.replace(titlePattern, "");
    return {
      data: {
        attributes: { title, body, sharable }
      }
    };
  }
}
