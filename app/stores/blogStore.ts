import { getDaysOfMonth } from "../util/date";
import { regionCodes } from "../util/regions";
import { clamp } from "../util/clamp";
import { avalancheProblems } from "../util/avalancheProblems";
import { BlogPostPreviewItem } from "./blog";
import { computed, map, onMount, StoreValue } from "nanostores";

export const $blogState = map({
  regions: {},
  supportedLanguages: ["de", "it", "en"] as const,
  languages: { de: true, it: true, en: true },
  year: "" as number | "",
  month: "" as number | "",
  problem: "",
  searchText: "",
  page: 1,
  loading: false,
  posts: {} as Record<string, BlogPostPreviewItem[]>,
  perPage: 20
});

onMount($blogState, () => {
  init();
  initLanguage();
  update();
});

export type BlogStore = StoreValue<typeof $blogState>;

export const postItems = computed($blogState, state =>
  Object.values(state.posts ?? {}).flat()
);

export const numberOfPosts = computed(postItems, postItems => postItems.length);

export const numberNewPosts = computed(
  postItems,
  postItems => postItems.filter(aPost => Date.now() < aPost.newUntil).length
);

export const maxPages = computed(
  [$blogState, numberOfPosts],
  (state, numberOfPosts) => Math.ceil(numberOfPosts / state.perPage)
);

export const languageActive = computed($blogState, state => {
  const active = Object.keys(state.languages).filter(
    lang => state.languages[lang]
  );
  return active.length > 1 ? "all" : active[0];
});

export const regionActive = computed($blogState, state => {
  const active = Object.keys(state.regions).filter(
    region => state.regions[region]
  );
  return active.length > 1 ? "all" : active[0];
});

export const startDate = computed($blogState, state => {
  if (state.year) {
    if (state.month) {
      return new Date(state.year, state.month - 1, 1);
    }
    return new Date(state.year, 0, 1);
  }
  return null;
});

export const endDate = computed($blogState, state => {
  if (state.year) {
    if (state.month) {
      return new Date(
        state.year,
        state.month - 1,
        getDaysOfMonth(state.year, state.month),
        23,
        59
      );
    }
    return new Date(state.year, 11, 31, 23, 59);
  }
  return null;
});

export const searchParams = computed(
  [$blogState, regionActive],
  (state, regionActive) => {
    const languageHostConfig = config.languageHostSettings;
    const l = state.languageActive;
    const searchLang =
      languageHostConfig[l] &&
      languageHostConfig[l] == document.location.hostname
        ? ""
        : state.languageActive;

    const params = new URLSearchParams();
    params.set("year", String(state.year));
    if (state.year != "") params.set("month", String(state.month));
    params.set("searchLang", searchLang || "");
    params.set("region", regionActive);
    params.set("problem", state.problem);
    params.set("page", String(state.page));
    params.set("searchText", state.searchText || "");
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
  if ($blogState.get().supportedLanguages.includes(valueToValidate)) {
    return valueToValidate;
  }
  valueToValidate = document.body.parentElement.lang;
  if ($blogState.get().supportedLanguages.includes(valueToValidate)) {
    return valueToValidate;
  }
  return "all";
}

export function validateProblem(valueToValidate: string): string {
  return avalancheProblems.includes(valueToValidate) ? valueToValidate : "all";
}

// checking if the url has been changed and applying new values
export function checkUrl(search: URLSearchParams): void {
  const state = $blogState.get();
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
  if (urlValues.year != state.year) {
    $blogState.setKey("year", urlValues.year);
    needLoad = true;
  }

  // month
  if (urlValues.month != state.month) {
    $blogState.setKey("month", urlValues.month);
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
  if (urlValues.problem != state.problem) {
    $blogState.setKey("problem", urlValues.problem);
    needLoad = true;
  }

  // page
  if (urlValues.page != state.page) {
    $blogState.setKey("page", urlValues.page);
    needLoad = true;
  }

  // searchText
  if (urlValues.searchText != state.searchText) {
    $blogState.setKey("searchText", urlValues.searchText || "");
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
  $blogState.setKey("posts", {});
  $blogState.setKey("page", initialParameters.page);

  $blogState.setKey("regions", initialParameters.regions);
  $blogState.setKey("languages", initialParameters.languages);
  $blogState.setKey("year", initialParameters.year);
  $blogState.setKey("month", initialParameters.month);
  $blogState.setKey("problem", initialParameters.problem);

  $blogState.setKey("loading", false);
  $blogState.setKey("searchText", initialParameters.searchText || "");
}

export function initLanguage() {
  const initialParameters = initialParams();
  $blogState.setKey("languages", initialParameters.languages);
}

export async function load(forceReload = false) {
  const state = $blogState.get();
  if (!forceReload && postItems.get().length > 0) {
    // don't do a reload if already loaded unless reload is forced
    return;
  }

  $blogState.setKey("loading", true);
  const posts = await BlogPostPreviewItem.loadBlogPosts(
    l => state.languages[l],
    r => state.regions[r],
    state
  );
  const newPosts = Object.fromEntries(posts);
  $blogState.setKey("posts", newPosts);
  $blogState.setKey("loading", false);
}

export function nextPage() {
  const thisPage = $blogState.get().page;
  const nextPageNo = thisPage < maxPages.get() ? thisPage + 1 : thisPage;
  $blogState.setKey("page", nextPageNo);
}

export function previousPage() {
  const thisPage = $blogState.get().page;
  const previousPageNo = thisPage > 1 ? thisPage - 1 : 1;
  $blogState.setKey("page", previousPageNo);
}

export function setRegions(region: string) {
  const newRegions = $blogState.get().regions;
  for (const r in newRegions) {
    newRegions[r] = [r, "all"].includes(region) || !region;
  }
  $blogState.setKey("regions", newRegions);
}

export function setLanguages(lang: string) {
  const newLanguages = $blogState.get().languages;
  for (const l in newLanguages) {
    newLanguages[l] = [l, "all"].includes(lang) || !lang;
  }
  $blogState.setKey("languages", newLanguages);
}

export const postsList = computed(
  [$blogState, numberOfPosts],
  (state, numberOfPosts) => {
    const start = (state.page - 1) * state.perPage;
    const limit = state.perPage;

    const posts = state.posts;
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
