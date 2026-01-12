import { clamp } from "../util/clamp";
import { BlogConfig, BlogPostPreviewItem, Category } from "./blog";
import { atom, computed, onMount, StoreValue } from "nanostores";
import { AvalancheProblemTypeSchema } from "./bulletin";

export const isTechBlog = atom<boolean>(false);
export const isProfileBlog = atom<boolean>(false);
export const region = atom<string | "all">("all");
export const supportedLanguages = atom(["de", "it", "en"] as const);
export const language = atom<"de" | "it" | "en">("en");
export const year = atom("" as number | "");
export const month = atom("" as number | "");
export const problem = atom("");
export const searchText = atom("");
export const page = atom(1);
export const loading = atom(false);
export const posts = atom({} as Record<string, BlogPostPreviewItem[]>);
export const categories = atom([] as Category[]);
export const searchCategory = atom("");
export const perPage = atom(20);
export const minYear = 2011;

onMount(language, () => init());

const timeZone = Temporal.Now.timeZoneId();

export interface BlogStore {
  searchCategory: string;
  searchText: string;
  year: number | "";
  startDate: Temporal.Instant | undefined;
  endDate: Temporal.Instant | undefined;
}

export const blogConfigs = computed(
  [language, region, isTechBlog, isProfileBlog],
  (language, region, isTechBlog, isProfileBlog): BlogConfig[] => {
    if (isTechBlog) {
      return [window.config.techBlog];
    }
    if (isProfileBlog) {
      return [window.config.profilesBlog];
    }
    return window.config.blogs
      .filter(cfg => [cfg.lang, "all", ""].includes(language))
      .filter(cfg => cfg.regions.some(r => [r, "all", ""].includes(region)));
  }
);

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

export const startDate = computed([year, month], (year, month) => {
  if (year) {
    if (month) {
      return new Temporal.PlainDate(year, month, 1);
    }
    return new Temporal.PlainDate(year, 1, 1);
  }
  return null;
});

export const endDate = computed([year, month], (year, month) => {
  if (year) {
    if (month) {
      return new Temporal.PlainDate(year, month + 1, 1);
    }
    return new Temporal.PlainDate(year + 1, 1, 1);
  }
  return null;
});

export const searchParams = computed(
  [year, month, problem, page, searchCategory, searchText, language, region],
  (
    year,
    month,
    problem,
    page,
    searchCategory,
    searchText,
    language,
    region
  ) => {
    const params = new URLSearchParams();
    if (year) {
      params.set("year", String(year));
      params.set("month", String(month));
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    params.set("problem", problem);
    params.set("region", region);
    params.set("searchCategory", searchCategory || "");
    params.set("searchLang", language);
    params.set("searchText", searchText || "");
    params.forEach((value, key) => value || params.delete(key));
    return params;
  }
);

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
    return clamp(parsed, minYear, Temporal.Now.plainDateISO().year);
  } else {
    return "";
  }
}

export function validateRegion(valueToValidate: string): string {
  return config.regionCodes.includes(valueToValidate) ? valueToValidate : "all";
}

export function validateLanguage(
  valueToValidate: string
): StoreValue<typeof language> {
  if (supportedLanguages.get().includes(valueToValidate)) {
    return valueToValidate;
  }
  valueToValidate = document.body.parentElement.lang;
  if (supportedLanguages.get().includes(valueToValidate)) {
    return valueToValidate;
  }
  return "en";
}

export function validateProblem(valueToValidate: string): string {
  return AvalancheProblemTypeSchema.safeParse(valueToValidate).success
    ? valueToValidate
    : "all";
}

export function init() {
  const search = new URL(document.location.href).searchParams;
  language.set(validateLanguage(search.get("searchLang")));
  loading.set(false);
  month.set(validateMonth(search.get("month")));
  page.set(validatePage(search.get("page")) || 1);
  posts.set({});
  problem.set(validateProblem(search.get("problem")));
  region.set(validateRegion(search.get("region")));
  searchCategory.set(search.get("searchCategory") || "");
  searchText.set(search.get("searchText") || "");
  year.set(validateYear(search.get("year")));
}

export async function load() {
  loading.set(true);
  await loadCategories();
  await loadPosts();
  loading.set(false);

  async function loadCategories() {
    categories.set(
      (await BlogPostPreviewItem.loadCategories(blogConfigs.get()))
        .flatMap(([, c]) => c)
        .filter(c => !/Uncategorised|Uncategorized/.test(c.name))
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
    );
  }

  async function loadPosts() {
    posts.set(
      Object.fromEntries(
        await BlogPostPreviewItem.loadBlogPosts(blogConfigs.get(), {
          searchCategory: categories
            .get()
            .filter(c => c.name === searchCategory.get())
            .map(c => c.id)
            .join(),
          searchText: searchText.get(),
          year: year.get(),
          startDate: startDate.get()?.toZonedDateTime(timeZone).toInstant(),
          endDate: endDate.get()?.toZonedDateTime(timeZone).toInstant()
        } satisfies BlogStore)
      )
    );
  }
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

export const postsList = computed(
  [page, perPage, postItems],
  (page, perPage, postItems) =>
    postItems
      .sort((p1, p2) => +p2.date - +p1.date)
      .slice((page - 1) * perPage, page * perPage)
);
