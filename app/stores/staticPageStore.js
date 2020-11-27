import axios from "axios";

export default class StaticPageStore {
  loadPage(url) {
    const lang = window["appStore"].language;
    url = `${APP_ASSET_PATH}content/${url}/${lang}.html`;
    return axios.get(url).then(response => {
      const sharable = true;
      // extract title from first <h1>...</h1>
      const titlePattern = /<h1>\s*(.*?)\s*<\/h1>/;
      const title = response.data.match(titlePattern)?.[1];
      const body = response.data.replace(titlePattern, "");
      return {
        data: {
          attributes: { title, body, sharable }
        }
      };
    });
  }
}
