/**
 * @param {XMLDocument} document
 */
export function convertCaamlToJson(document) {
  const children = [...document.children];
  const json = {};

  /**
   * @type NamedNodeMap
   */
  const attributes = document.attributes || [];
  for (var i = 0; i < attributes.length; i++) {
    const { name, value } = attributes[i];
    if (!/^xmlns/.test(name)) {
      json[name.replace(/^.*:/, "")] = value;
    }
  }

  // base case for recursion
  if (!children.length) {
    json.$ = document.innerHTML || undefined;
    if (!attributes.length) {
      return json.$;
    } else if (json.href) {
      return json.href;
    } else {
      return json;
    }
  }

  // recurse children
  for (var child of children) {
    const asArray =
      // checking is child has siblings of same name.
      children.filter(i => i.nodeName === child.nodeName).length > 1 ||
      [
        "AvProblem",
        "Bulletin",
        "BulletinMeasurements",
        "DangerPattern",
        "DangerRating",
        "locRef",
        "MetaData",
        "validAspect"
      ].indexOf(child.nodeName) >= 0;

    // if child is array, save the values as array, else as strings.
    if (asArray && json[child.nodeName] === undefined) {
      json[child.nodeName] = [convertCaamlToJson(child)];
    } else if (asArray) {
      json[child.nodeName].push(convertCaamlToJson(child));
    } else {
      json[child.nodeName] = convertCaamlToJson(child);
    }
  }

  // unwrap array structure
  switch (document.nodeName) {
    case "avProblems":
      return json.AvProblem;
    case "bulletinResultsOf":
      return json.BulletinMeasurements;
    case "dangerPatterns":
      return json.DangerPattern;
    case "dangerRatings":
      return json.DangerRating;
    case "metaDataProperty":
      return json.MetaData;
    case "observations":
      return json.Bulletin;
  }
  return json;
}
