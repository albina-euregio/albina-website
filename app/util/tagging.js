const labelRegex = /^(dp|DP|gm|GM|st|ST)\s*(\d+)/;

function parseTags(tagList) {
  if(Array.isArray(tagList)) {
    return tagList
      .filter((l) => l.match(labelRegex))
      .map((l) => l.replace(labelRegex, 'dp$2'))
  }
  return [];
}

export { parseTags }
