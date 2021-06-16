import { observable, action, computed, toJS } from "mobx";
import { fetchJSON } from "../util/fetch";
import { parseDate, getDaysOfMonth } from "../util/date";
import { parseTags } from "../util/tagging";
import L from "leaflet";
import { regionCodes } from "../util/regions";
import { parseSearchParams } from "../util/searchParams";
import { clamp } from "../util/clamp";

class BlogPostPreviewItem {
  constructor(
    blogName,
    postId,
    url,
    author,
    date,
    title,
    lang,
    regions = [],
    image = null,
    tags = [],
    newUntil
  ) {
    this.blogName = blogName;
    this.postId = postId;
    this.url = url;
    this.author = author;
    this.date = date;
    this.title = title;
    this.lang = lang;
    this.regions = regions;
    this.image = image;
    this.tags = tags;
    this.newUntil = newUntil;
  }
}

export default class BlogStore {
  _regions;
  _languages;
  _year;
  _month;
  _problem;
  _searchText;

  _page;

  _loading;
  _posts;

  updateURL = false;

  // show only 5 blog posts when the mobile phone is detected
  perPage = L.Browser.mobile ? 20 : 20;
  getHistory;

  update() {
    const languageHostConfig = config.languageHostSettings;
    const l = this.languageActive;
    const searchLang =
      languageHostConfig[l] &&
      languageHostConfig[l] == document.location.hostname
        ? ""
        : this.languageActive;

    if (this.updateURL) {
      const params = new URLSearchParams();
      params.set("year", this.year);
      if (this.year != "") params.set("month", this.month);
      params.set("searchLang", searchLang || "");
      params.set("region", this.regionActive);
      params.set("problem", this.problem);
      params.set("page", this.page);
      params.set("searchText", this.searchText || "");
      params.forEach((value, key) => value || params.delete(key));
      this.getHistory().push({ search: params.toString() });
    }

    this.load(true);
  }

  validatePage(valueToValidate) {
    const maxPages = this.maxPages;
    return clamp(valueToValidate, 1, maxPages);
  }

  validateMonth(valueToValidate) {
    const parsed = parseInt(valueToValidate);
    if (parsed) {
      return clamp(parsed, 1, 12);
    } else {
      return "";
    }
  }

  validateYear(valueToValidate) {
    const parsed = parseInt(valueToValidate);
    if (parsed) {
      return clamp(parsed, config.archive.minYear, new Date().getFullYear());
    } else {
      return "";
    }
  }

  validateRegion(valueToValidate) {
    return regionCodes.includes(valueToValidate) ? valueToValidate : "all";
  }

  validateLanguage(valueToValidate) {
    return window["appStore"].languages.includes(valueToValidate) ||
      valueToValidate === "all"
      ? valueToValidate
      : window["appStore"].language;
  }

  validateProblem(valueToValidate) {
    return window["appStore"].avalancheProblems.includes(valueToValidate)
      ? valueToValidate
      : "all";
  }

  // checking if the url has been changed and applying new values
  checkUrl() {
    let needLoad = false;

    const search = parseSearchParams();
    const urlValues = {
      year: this.validateYear(search.get("year")),
      month: this.validateMonth(search.get("month")),
      searchLang: this.validateLanguage(search.get("searchLang")),
      region: this.validateRegion(search.get("region")),
      problem: this.validateProblem(search.get("problem")),
      page: this.validatePage(search.get("page")),
      searchText: search.get("searchText")
    };

    // year
    if (urlValues.year != this.year) {
      this.year = urlValues.year;
      needLoad = true;
    }

    // month
    if (urlValues.month != this.month) {
      this.month = urlValues.month;
      needLoad = true;
    }

    // language
    if (urlValues.searchLang != this.languageActive) {
      this.setLanguages(urlValues.searchLang);
      needLoad = true;
    }

    // region
    if (urlValues.region != this.regionActive) {
      this.setRegions(urlValues.region);
      needLoad = true;
    }

    // problem
    if (urlValues.problem != this.problem) {
      this.problem = urlValues.problem;
      needLoad = true;
    }

    // page
    if (urlValues.page != this.page) {
      this.setPage(urlValues.page);
      needLoad = true;
    }

    // searchText
    if (urlValues.searchText != this.searchText) {
      this.searchText = urlValues.searchText;
      needLoad = true;
    }

    if (needLoad) {
      // console.log("reload needed");
      this.load(true);
    }
  }

  getNewUntil(labels, published) {
    let newUntil = new Date(published);
    //newUntil.setMonth(newUntil.getMonth() + 12);
    if (labels.includes("valid_72h"))
      return newUntil.setHours(newUntil.getHours() + 72);
    if (labels.includes("valid_48h"))
      return newUntil.setHours(newUntil.getHours() + 48);
    return newUntil.setHours(newUntil.getHours() + 24);
  }

  initialParams() {
    const search = parseSearchParams();
    const searchLang = this.validateLanguage(search.get("searchLang"));

    const initialParameters = {
      year: this.validateYear(search.get("year")),
      month: this.validateMonth(search.get("month")),
      problem: this.validateProblem(search.get("problem")),
      page: this.validatePage(search.get("page")) || 1,
      searchText: search.get("searchText"),
      languages: {
        de: ["", "de", "all"].includes(searchLang) || !searchLang,
        it: ["", "it", "all"].includes(searchLang) || !searchLang,
        fr: ["", "fr", "all"].includes(searchLang) || !searchLang,
        en: ["", "en", "all"].includes(searchLang) || !searchLang
      }
    };

    // get all regions from appStore and activate them
    const searchRegion = this.validateRegion(search.get("region"));
    const initialRegions = {};
    regionCodes.forEach(region => {
      initialRegions[region] =
        ["", "all", region].includes(searchRegion) || !searchRegion;
    });
    initialParameters.regions = initialRegions;

    return initialParameters;
  }

  constructor(getHistory) {
    this.getHistory = getHistory;

    const initialParameters = this.initialParams();

    // Do not make posts observable, otherwise posts list will be
    // unnecessaryliy rerendered during the filling of this array.
    // Views should only observe the value of the "loading" flag instead.
    this._posts = observable.box({});
    this._page = observable.box(initialParameters.page);

    this._regions = observable.box(initialParameters.regions);
    this._languages = observable.box(initialParameters.languages);
    this._year = observable.box(initialParameters.year);
    this._month = observable.box(initialParameters.month);
    this._problem = observable.box(initialParameters.problem);

    // For Mobx > v4 we have to use an obserable box instead of
    // @observable loading = ...;
    this._loading = observable.box(false);
    this._searchText = observable.box(initialParameters.searchText);

    this.blogProcessor = {
      blogger: {
        createUrl: config => {
          let baseUrl =
            window.config.apis.blogger + config.params.id + "/posts";

          const params = {
            maxResults: 500,
            fetchBodies: false,
            fetchImages: true,
            status: "live",
            key: window.config.apiKeys.google
          };
          if (this.searchText) {
            params["q"] = this.searchText;
            baseUrl += "/search";
          } else {
            if (this.problem && this.problem !== "all") {
              params["labels"] = this.problem;
            }
            if (this.year) {
              params["startDate"] = this.startDate.toISOString();
              params["endDate"] = this.endDate.toISOString();
            }
          }

          return baseUrl + "?" + new URLSearchParams(params);
        },

        process: (response, config) => {
          if (Array.isArray(response.items)) {
            return response.items.map(item => {
              const previewImage =
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0].url
                  : null;

              return new BlogPostPreviewItem(
                config.name,
                item.id,
                item.url,
                item.author.displayName,
                parseDate(item.published),
                item.title,
                config.lang,
                config.regions,
                previewImage,
                parseTags(item.labels),
                this.getNewUntil(item.labels || [], parseDate(item.published))
              );
            });
          }
          return [];
        }
      }
    };
    this.update();
  }

  @action load(forceReload = false) {
    if (!forceReload && this._posts.length > 0) {
      // don't do a reload if already loaded unless reload is forced
      return;
    }

    this._loading.set(true);

    const blogsConfig = window.config.blogs;
    const loads = [];

    const newPosts = {};

    // filter config for lang and region
    // eslint-disable-next-line no-unused-vars
    for (let cfg of blogsConfig) {
      newPosts[cfg.name] = [];

      if (this.languages[cfg.lang] && this.languages[cfg.lang]) {
        if (cfg.regions.some(r => this.regions[r] && this.regions[r])) {
          if (this.blogProcessor[cfg.apiType]) {
            const p = this.blogProcessor[cfg.apiType];
            const url = p.createUrl(cfg);

            loads.push(
              fetchJSON(url).then(
                data => {
                  p.process(data, cfg).forEach(i => {
                    newPosts[cfg.name].push(i);
                  });
                },
                (errorText, statusCode) => {
                  console.warn(errorText);
                  if (
                    parseInt(statusCode) == 304 &&
                    Array.isArray(this._posts[cfg.name])
                  ) {
                    newPosts[cfg.name] = this._posts[cfg.name];
                  }
                }
              )
            );
          }
        }
      }
    }

    //todo: indicate loading error
    return Promise.all(loads).then(() => {
      // console.log("posts loaded", newPosts);
      this.posts = newPosts;
      this._loading.set(false);
    });
  }

  @computed get loading() {
    return this._loading.get();
  }

  set loading(flag) {
    this._loading.set(flag);
  }

  @computed get posts() {
    return toJS(this._posts);
  }

  set posts(val) {
    this._posts.set(val);
  }

  /* actual page in the pagination through blog posts */
  @computed get page() {
    return parseInt(toJS(this._page));
  }
  set page(val) {
    this._page.set(parseInt(val));
  }

  @action setPage(newPage) {
    this.page = this.validatePage(newPage);
  }

  @action nextPage() {
    const thisPage = this.page;
    const maxPages = this.maxPages;
    const nextPageNo = thisPage < maxPages ? thisPage + 1 : thisPage;
    this.setPage(nextPageNo);
  }
  @action previousPage() {
    const thisPage = this.page;
    const previousPageNo = thisPage > 1 ? thisPage - 1 : 1;
    this.setPage(previousPageNo);
  }
  @computed get maxPages() {
    return Math.ceil(this.numberOfPosts / this.perPage);
  }

  @computed get searchText() {
    return this._searchText.get();
  }
  set searchText(val) {
    if (val != this.searchText) {
      this._searchText.set(val);
    }
  }

  @computed get problem() {
    return this._problem.get();
  }
  set problem(val) {
    this._problem.set(val);
  }

  @computed get year() {
    return this._year.get();
  }
  set year(y) {
    this._year.set(y);
  }

  @computed get month() {
    return this._month.get();
  }
  set month(m) {
    this._month.set(m);
  }

  @computed get startDate() {
    if (this.year) {
      if (this.month) {
        return new Date(this.year, this.month - 1, 1);
      }
      return new Date(this.year, 0, 1);
    }
    return null;
  }

  @computed get endDate() {
    if (this.year) {
      if (this.month) {
        return new Date(
          this.year,
          this.month - 1,
          getDaysOfMonth(this.year, this.month),
          23,
          59
        );
      }
      return new Date(this.year, 11, 31, 23, 59);
    }
    return null;
  }

  @computed get languages() {
    return toJS(this._languages);
  }
  @computed get regions() {
    return toJS(this._regions);
  }

  @action setRegions(region) {
    const newRegions = this.regions;
    // eslint-disable-next-line no-unused-vars
    for (let r in newRegions) {
      newRegions[r] = [r, "all"].includes(region) || !region;
    }
    console.log("blogstore->setRegions xx101", newRegions);
    this._regions.set(newRegions);
  }

  @action setLanguages(lang) {
    const newLanguages = this.languages;
    // eslint-disable-next-line no-unused-vars
    for (let l in newLanguages) {
      newLanguages[l] = [l, "all"].includes(lang) || !lang;
    }
    this._languages.set(newLanguages);
  }

  @computed get languageActive() {
    const active = Object.keys(this.languages).filter(
      lang => this.languages[lang]
    );
    return active.length > 1 ? "all" : active[0];
  }

  @computed get regionActive() {
    const active = Object.keys(this.regions).filter(
      region => this.regions[region]
    );
    return active.length > 1 ? "all" : active[0];
  }

  @computed get numberOfPosts() {
    return this.posts
      ? Object.values(this.posts)
          .map(l => l.length)
          .reduce((acc, v) => acc + v, 0)
      : 0;
  }

  @computed get numberNewPosts() {
    const currentDate = new Date().getTime();
    let nrOfNewPosts = 0;
    if (this.posts) {
      // eslint-disable-next-line no-unused-vars
      for (let prop in this.posts) {
        this.posts[prop].forEach(aPost => {
          if (currentDate < aPost.newUntil) nrOfNewPosts++;
        });
      }
    }
    return nrOfNewPosts;
  }

  @computed get postsList() {
    const start = (this.page - 1) * this.perPage;
    const limit = this.perPage;
    const totalLength = this.numberOfPosts;

    const posts = this.posts;
    const queues = Object.keys(posts);

    const startIndex = Math.min(start, totalLength - 1);
    const end = Math.min(start + limit, totalLength);

    const postPointer = {};
    queues.forEach(queue => {
      postPointer[queue] = 0;
    });

    const getNext = () => {
      // get the next items of all queues
      const candidates = {};
      queues.forEach(queue => {
        if (posts[queue].length > postPointer[queue]) {
          candidates[queue] = posts[queue][postPointer[queue]];
        }
      });

      // find the maximum
      const queueMax = Object.keys(candidates).reduce((acc, queue) => {
        if (!acc || candidates[queue].date > candidates[acc].date) {
          return queue;
        }
        return acc;
      }, "");

      if (queueMax) {
        const next = posts[queueMax][postPointer[queueMax]];
        postPointer[queueMax]++;
        return next;
      }
      return null;
    };

    const list = [];
    if (startIndex >= 0) {
      for (let i = 0; i < startIndex; i++) {
        getNext();
      }

      for (let j = startIndex; j < end; j++) {
        const n = getNext();
        if (n) {
          list.push(n);
        }
      }

      return list;
    }
    return [];
  }
}
