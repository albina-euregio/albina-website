import { avalancheProblems } from "./avalancheProblems";

function parseTags(tagList) {
  if (Array.isArray(tagList)) {
    return tagList.filter(l => avalancheProblems.indexOf(l) >= 0);
  }
  return [];
}

export { parseTags };
