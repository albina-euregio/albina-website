import axios from "axios";

export default class StaticPageStore {
  loadPage(url) {
    const lang = window["appStore"].language;
    return axios.get(`/content/${url}/${lang}.html`).then(response => {
      const body = response.data;
      return {
        data: {
          attributes: { body }
        }
      };
    });
  }

  loadBlock(name) {
    const lang = window["appStore"].language;
    const langParam = !lang || lang == "en" ? "" : lang + "/";
    const url =
      config.get("apis.content") + langParam + "api/block_content/" + name;
    return axios.get(url).then(response => response.data);
  }
}
