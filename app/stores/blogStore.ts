import { getDaysOfMonth } from "../util/date";
import { regionCodes } from "../util/regions";
import { clamp } from "../util/clamp";
import { avalancheProblems } from "../util/avalancheProblems";
import { BlogPostPreviewItem } from "./blog";
import { atom, computed, StoreValue } from "nanostores";

export const regions = atom({});
export const supportedLanguages = atom(["de", "it", "en"] as const);
export const languages = atom({ de: true, it: true, en: true });
export const year = atom("" as number | "");
export const month = atom("" as number | "");
export const problem = atom("");
export const searchText = atom("");
export const page = atom(1);
export const loading = atom(false);
export const posts = atom({} as Record<string, BlogPostPreviewItem[]>);
export const perPage = atom(20);

export type BlogStore = StoreValue<typeof $blogState>;

export const postItems = computed(posts, posts =>
  Object.values(posts ?? {}).flat()
);

export const numberOfPosts = computed(postItems, postItems => postItems.length);

export const numberNewPosts = computed(
  postItems,
  postItems => postItems.filter(aPost => Date.now() < aPost.newUntil).length
);

export const maxPages = computed(
  [perPage, numberOfPosts],
  (perPage, numberOfPosts) => Math.ceil(numberOfPosts / perPage)
);

export const languageActive = computed(languages, languages => {
  const active = Object.keys(languages).filter(lang => languages[lang]);
  return active.length > 1 ? "all" : active[0];
});

export const regionActive = computed(regions, regions => {
  const active = Object.keys(regions).filter(region => regions[region]);
  return active.length > 1 ? "all" : active[0];
});

export const startDate = computed([year, month], (year, month) => {
  if (year) {
    if (month) {
      return new Date(year, month - 1, 1);
    }
    return new Date(year, 0, 1);
  }
  return null;
});

export const endDate = computed([year, month], (year, month) => {
  if (year) {
    if (month) {
      return new Date(year, month - 1, getDaysOfMonth(year, month), 23, 59);
    }
    return new Date(year, 11, 31, 23, 59);
  }
  return null;
});

export const searchParams = computed(
  [year, month, problem, page, searchText, languageActive, regionActive],
  (year, month, problem, page, searchText, languageActive, regionActive) => {
    const languageHostConfig = config.languageHostSettings;
    const l = languageActive;
    const searchLang =
      languageHostConfig[l] &&
      languageHostConfig[l] == document.location.hostname
        ? ""
        : languageActive;

    const params = new URLSearchParams();
    params.set("year", String(year));
    if (year != "") params.set("month", String(month));
    params.set("searchLang", searchLang || "");
    params.set("region", regionActive);
    params.set("problem", problem);
    params.set("page", String(page));
    params.set("searchText", searchText || "");
    params.forEach((value, key) => value || params.delete(key));
    return params;
  }
);

export function update() {
  load(true);
}

export function validatePage(page: string | number): number {
  const parsed = typeof page === "string" ? parseInt(page) : page;
  return clamp(parsed, 1, maxPages.get());
}

export function validateMonth(valueToValidate: string): number | "" {
  const parsed = parseInt(valueToValidate);
  if (parsed) {
    return clamp(parsed, 1, 12);
  } else {
    return "";
  }
}

export function validateYear(valueToValidate: string): number | "" {
  const parsed = parseInt(valueToValidate);
  if (parsed) {
    return clamp(
      parsed,
      window.config?.archive?.minYear ?? 2016,
      new Date().getFullYear()
    );
  } else {
    return "";
  }
}

export function validateRegion(valueToValidate: string): string {
  return regionCodes.includes(valueToValidate) ? valueToValidate : "all";
}

export function validateLanguage(valueToValidate: string): string {
  if (valueToValidate === "all") {
    return valueToValidate;
  }
  if (supportedLanguages.get().includes(valueToValidate)) {
    return valueToValidate;
  }
  valueToValidate = document.body.parentElement.lang;
  if (supportedLanguages.get().includes(valueToValidate)) {
    return valueToValidate;
  }
  return "all";
}

export function validateProblem(valueToValidate: string): string {
  return avalancheProblems.includes(valueToValidate) ? valueToValidate : "all";
}

// checking if the url has been changed and applying new values
export function checkUrl(search: URLSearchParams): void {
  let needLoad = false;

  const urlValues = {
    year: validateYear(search.get("year")),
    month: validateMonth(search.get("month")),
    searchLang: validateLanguage(search.get("searchLang")),
    region: validateRegion(search.get("region")),
    problem: validateProblem(search.get("problem")),
    page: validatePage(search.get("page")),
    searchText: search.get("searchText") || ""
  };

  // year
  if (urlValues.year != year.get()) {
    year.set(urlValues.year);
    needLoad = true;
  }

  // month
  if (urlValues.month != month.get()) {
    month.set(urlValues.month);
    needLoad = true;
  }

  // language
  if (urlValues.searchLang != languageActive.get()) {
    setLanguages(urlValues.searchLang);
    needLoad = true;
  }

  // region
  if (urlValues.region != regionActive.get()) {
    setRegions(urlValues.region);
    needLoad = true;
  }

  // problem
  if (urlValues.problem != problem.get()) {
    problem.set(urlValues.problem);
    needLoad = true;
  }

  // page
  if (urlValues.page != page.get()) {
    page.set(urlValues.page);
    needLoad = true;
  }

  // searchText
  if (urlValues.searchText != searchText.get()) {
    searchText.set(urlValues.searchText || "");
    needLoad = true;
  }

  if (needLoad) {
    load(true);
  }
}

export function initialParams() {
  const search = new URL(document.location.href).searchParams;
  const searchLang = validateLanguage(search.get("searchLang"));

  const initialParameters = {
    year: validateYear(search.get("year")),
    month: validateMonth(search.get("month")),
    problem: validateProblem(search.get("problem")),
    page: validatePage(search.get("page")) || 1,
    searchText: search.get("searchText"),
    languages: {
      de: ["", "de", "all"].includes(searchLang) || !searchLang,
      it: ["", "it", "all"].includes(searchLang) || !searchLang,
      en: ["", "en", "all"].includes(searchLang) || !searchLang
    },
    regions: {}
  };

  // get all regions from appStore and activate them
  const searchRegion = validateRegion(search.get("region"));
  const initialRegions = {};
  regionCodes.forEach(region => {
    initialRegions[region] =
      ["", "all", region].includes(searchRegion) || !searchRegion;
  });
  initialParameters.regions = initialRegions;

  return initialParameters;
}

export function init() {
  const initialParameters = initialParams();

  // Do not make posts observable, otherwise posts list will be
  // unnecessarily rerendered during the filling of this array.
  // Views should only observe the value of the "loading" flag instead.
  posts.set({});
  page.set(initialParameters.page);

  regions.set(initialParameters.regions);
  languages.set(initialParameters.languages);
  year.set(initialParameters.year);
  month.set(initialParameters.month);
  problem.set(initialParameters.problem);

  loading.set(false);
  searchText.set(initialParameters.searchText || "");
}

export function initLanguage() {
  const initialParameters = initialParams();
  languages.set(initialParameters.languages);
}

export async function load(forceReload = false) {
  if (!forceReload && postItems.get().length > 0) {
    // don't do a reload if already loaded unless reload is forced
    return;
  }

  loading.set(true);
  const posts0 = await BlogPostPreviewItem.loadBlogPosts(
    l => languages.get()[l],
    r => regions.get()[r],
    {} // FIXME
  );
  const newPosts = Object.fromEntries(posts0);
  posts.set(newPosts);
  loading.set(false);
}

export function nextPage() {
  const thisPage = page.get();
  const nextPageNo = thisPage < maxPages.get() ? thisPage + 1 : thisPage;
  page.set(nextPageNo);
}

export function previousPage() {
  const thisPage = page.get();
  const previousPageNo = thisPage > 1 ? thisPage - 1 : 1;
  page.set(previousPageNo);
}

export function setRegions(region: string) {
  const newRegions = regions.get();
  for (const r in newRegions) {
    newRegions[r] = [r, "all"].includes(region) || !region;
  }
  regions.set(newRegions);
}

export function setLanguages(lang: string) {
  const newLanguages = languages.get();
  for (const l in newLanguages) {
    newLanguages[l] = [l, "all"].includes(lang) || !lang;
  }
  languages.set(newLanguages);
}

export const postsList = computed(
  [page, perPage, posts, numberOfPosts],
  (page, perPage, posts, numberOfPosts) => {
    const start = (page - 1) * perPage;
    const limit = perPage;

    const queues = Object.keys(posts);

    const startIndex = Math.min(start, numberOfPosts - 1);
    const end = Math.min(start + limit, numberOfPosts);

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
);
