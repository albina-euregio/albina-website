export interface BlogConfig {
  lang: string;
  name: string;
  apiType: "blogger" | "wordpress";
  regions: string[];
  params: {
    id: string;
  };
}
