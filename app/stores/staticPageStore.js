import axios from "axios";

export default class StaticPageStore {
  loadPage(url) {
    const lang = window["appStore"].language;
    return axios.get(`/content/${url}/${lang}.html`).then(response => {
      const sharable = true;
      const body = response.data;
      let title = body.match(/^<!--\s*title:\s*(.*)-->/);
      title = title ? title[1] : undefined;
      return {
        data: {
          attributes: { title, body, sharable }
        }
      };
    });
  }
}
