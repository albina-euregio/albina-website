export interface BlogConfig {
  lang: string;
  name: string;
  apiType: "blogger" | "wordpress";
  regions: string[];
  params: {
    id: string;
  };
}

export function mappedCategoryName(name: string): string {
  const categoryNameMap = window.config.categoryNameMap ?? {};
  return categoryNameMap[name] || name;
}
