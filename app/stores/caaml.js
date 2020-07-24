/**
 * @param {XMLDocument} document
 * @returns {Caaml.Bulletins} caaml
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
    if (!/^(xmlns|xsi)/.test(name)) {
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
    const forceArray = [
      "aspect",
      "avalancheProblem",
      "bulletin",
      "dangerPattern",
      "extFile",
      "metaData",
      "region"
    ];
    const asArray =
      // checking if child has siblings of same name.
      children.some(i => i !== child && i.nodeName === child.nodeName) ||
      // or child name is forced to be an array
      forceArray.includes(child.nodeName) ||
      (document.nodeName === "bulletin" && child.nodeName === "dangerRating");

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
    case "#document":
      return json.bulletins;
  }
  return json;
}

/**
 * @param {Caaml.Bulletin[]} bulletins
 * @returns {Albina.DaytimeBulletin[]}
 */
export function toDaytimeBulletins(bulletins) {
  const getWarnlevelNumber = id => window["appStore"].getWarnlevelNumber(id);
  return bulletins
    .map(forenoon => {
      if (forenoon.id.match(/_PM$/)) return;
      /**
       * @type {Albina.DaytimeBulletin}
       */
      const albina = {
        id: forenoon.id,
        forenoon: forenoon,
        afternoon: bulletins.find(b => b.id === forenoon.id + "_PM")
      };
      albina.hasDaytimeDependency = !!albina.afternoon;
      albina.maxWarnlevel = [
        ...(albina?.forenoon?.dangerRating?.map(r => r.mainValue) || []),
        ...(albina?.afternoon?.dangerRating?.map(r => r.mainValue) || [])
      ].reduce((r1, r2) =>
        getWarnlevelNumber(r1) > getWarnlevelNumber(r2) ? r1 : r2
      );
      return albina;
    })
    .filter(bulletin => !!bulletin);
}
