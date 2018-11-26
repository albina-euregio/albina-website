import { observable, action, computed, toJS } from "mobx";
import Base from "../base";
import { parseDate, getDaysOfMonth } from "../util/date";
import { parseTags } from "../util/tagging";

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
    tags = []
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
  }
}

export default class BlogStore {
  regions;
  languages;
  _year;
  _month;
  _avalancheProblem;
  _searchText;
  _loading;
  _posts;
  _page;
  perPage = 10;

  constructor() {
    // get all regions from appStore and activate them
    const rs = Object.keys(window["appStore"].regions).reduce((acc, r) => {
      acc[r] = { active: true };
      return acc;
    }, {});
    this.regions = observable(rs);

    this.languages = observable({
      de: { active: true },
      it: { active: true },
      en: { active: true }
    });

    // Do not make posts observable, otherwise posts list will be
    // unnecessaryliy rerendered during the filling of this array.
    // Views should only observe the value of the "loading" flag instead.
    this._posts = observable.box({});
    this._page = observable.box(1);

    this._year = observable.box("");
    this._month = observable.box("");
    this._avalancheProblem = observable.box("");

    // setting the actual date
    const date = new Date();
    this._year.set(date.getFullYear());
    this._month.set(date.getMonth() + 1);

    // For Mobx > v4 we have to use an obserable box instead of
    // @observable loading = ...;
    this._loading = observable.box(false);
    this._searchText = observable.box("");

    this.blogProcessor = {
      blogger: {
        createUrl: config => {
          const baseUrl =
            window["config"].get("apis.blogger") + config.params.id + "/posts";

          const params = {
            key: window["config"].get("apiKeys.google"),
            fetchBodies: false,
            fetchImages: true,
            status: "live"
          };
          if (this.searchText) {
            params["q"] = this.searchText;
          } else {
            if (this.avalancheProblem) {
              params["labels"] = this.avalancheProblem;
            }
            if (this.year) {
              params["startDate"] = this._startDate.toISOString();
              params["endDate"] = this._endDate.toISOString();
            }
          }

          return Base.makeUrl(baseUrl + (params["q"] ? "/search" : ""), params);
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
                parseTags(item.labels)
              );
            });
          }
          return [];
        }
      }
    };
  }

  @action load(forceReload = false) {
    if (!forceReload && this._posts.length > 0) {
      // don't do a reload if already loaded unless reload is forced
      return;
    }

    this.loading = true;

    const blogsConfig = window["config"].get("blogs");
    const loads = [];

    const newPosts = {};

    // filter config for lang and region
    for (let cfg of blogsConfig) {
      newPosts[cfg.name] = [];

      if (this.languages[cfg.lang] && this.languages[cfg.lang].active) {
        if (cfg.regions.some(r => this.regions[r] && this.regions[r].active)) {
          if (this.blogProcessor[cfg.apiType]) {
            const p = this.blogProcessor[cfg.apiType];

            const url = p.createUrl(cfg);
            console.log(url);
            loads.push(
              Base.doRequest(url).then(
                response => {
                  p.process(JSON.parse(response), cfg).forEach(i => {
                    newPosts[cfg.name].push(i);
                  });
                },
                (errorText, statusCode) => {
                  console.log(errorText);
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

    return Promise.all(loads).then(() => {
      this.posts = newPosts;
      this.loading = false;
    });
  }

  get posts() {
    return this._posts.get();
  }

  set posts(val) {
    this._posts.set(val);
  }

  /* actual page in the pagination through blog posts */
  get page() {
    return this._page.get();
  }

  @action nextPage() {
    const thisPage = this.page;
    const maxPages = this.maxPages;
    const nextPageNo = thisPage < maxPages ? thisPage + 1 : thisPage;
    this._page.set(nextPageNo);
  }
  @action previousPage() {
    const thisPage = this.page;
    const previousPageNo = thisPage > 1 ? thisPage - 1 : 1;
    this._page.set(previousPageNo);
  }

  @computed get maxPages() {
    return Math.ceil(this.numberOfPosts / this.perPage);
  }

  set page(val) {
    this._page.set(val);
  }

  get loading() {
    return this._loading.get();
  }

  set loading(val) {
    this._loading.set(val);
  }

  get searchText() {
    return this._searchText.get();
  }

  set searchText(val) {
    if (val != this._searchText.get()) {
      this._searchText.set(val);
      this.load(true);
    }
  }

  get avalancheProblem() {
    return this._avalancheProblem.get();
  }

  set avalancheProblem(val) {
    this._avalancheProblem.set(val);
    this.load(true);
  }

  @computed get languageFilter() {
    const languages = toJS(this.languages);
    const activeLanguages = Object.keys(languages).filter(
      lang => languages[lang].active
    );

    return activeLanguages.length > 1 ? "all" : activeLanguages[0];
  }

  get year() {
    return this._year.get();
  }

  set year(y) {
    this._year.set(y);
    this.load(true);
  }

  get month() {
    return this._month.get();
  }

  set month(m) {
    this._month.set(m);
    this.load(true);
  }

  get _startDate() {
    if (this.year) {
      if (this.month) {
        return new Date(this.year, this.month - 1, 1);
      }
      return new Date(this.year, 0, 1);
    }
    return null;
  }

  get _endDate() {
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

  @action setRegionFilter(region) {
    for (let r in this.regions) {
      this.regions[r].active = !region || r === region;
    }
    this.load(true);
  }

  @action setLanguageFilter(lang) {
    for (let l in this.languages) {
      this.languages[l].active = !lang || l === lang;
    }
    this.load(true);
  }

  @computed get numberOfPosts() {
    return Object.values(this.posts)
      .map(l => l.length)
      .reduce((acc, v) => acc + v, 0);
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
