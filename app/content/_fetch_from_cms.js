/* eslint-env node */
const child_process = require("child_process");
const fs = require("fs");

fetch("de");
fetch("en");
fetch("it");

function fetch(lang) {
  const pages = curl(
    `https://api.avalanche.report/cms/${lang}/api/pages`.replace("en/", "")
  ).data;
  const menus = curl(
    `https://api.avalanche.report/cms/${lang}/api/menuLinks?fields[menuLinks]=internalId,title,link,menuInternalId,parentIs,isExternal&sort=weight`.replace(
      "en/",
      ""
    )
  ).data;

  pages.forEach(page => console.log(page.attributes.title));
  console.log();
  menus
    .filter(menu => menu.attributes.link.match(/^internal:/))
    .forEach(menu => {
      const title = menu.attributes.title;
      const path = menu.attributes.link.replace(/^internal:/, "");
      let uuid;
      try {
        uuid = curl(
          "https://api.avalanche.report/cms/router/translate-path?_format=json&path=//" +
            path
        ).entity.uuid;
      } catch (e) {
        return;
      }
      console.log(path, uuid, title);
      const page = pages.find(p => p.id === uuid);
      const html = page.attributes.body || "";
      fs.mkdirSync(__dirname + path, { recursive: true });
      fs.writeFileSync(`${__dirname}${path}/${lang}.html`, html, "utf-8");
    });
  console.log();
}

function curl(url) {
  const json = child_process.execFileSync("curl", ["--silent", url]);
  return JSON.parse(json);
}
