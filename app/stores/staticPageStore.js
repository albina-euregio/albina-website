import axios from "axios";

export default class StaticPageStore {
  loadPage(url) {
    const lang = window["appStore"].language;
    url = `${APP_ASSET_PATH}content/${url}/${lang}.html`;
    return axios.get(url).then(response => {
      const sharable = true;
      const body = response.data;
      let title = body.match(/^<!--\s*title:\s*(.*?)\s*-->/);
      title = title ? title[1] : undefined;
      return {
        data: {
          attributes: { title, body, sharable }
        }
      };
    });
  }
}
