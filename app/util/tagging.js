function parseTags(tagList) {
  if (Array.isArray(tagList)) {
    return tagList.filter(
      l => window["appStore"].avalancheProblems.indexOf(l) >= 0
    );
  }
  return [];
}

export { parseTags };
