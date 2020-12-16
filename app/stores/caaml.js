/**
 * @param {XMLDocument} document
 * @returns {Caaml.Bulletins} caaml
 */
export function convertCaamlToJson(document) {
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
  if (!document?.children?.length) {
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
  for (let i = 0; i < document.children.length; i++) {
    const child = document.children[i];
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
      forceArray.includes(child.nodeName) ||
      (document.nodeName === "bulletin" && child.nodeName === "dangerRating");
    const arrayChildName = {
      aspect: "aspects",
      avalancheProblem: "avalancheProblems",
      bulletin: "bulletins",
      dangerPattern: "dangerPatterns",
      dangerRating: "dangerRatings",
      extFile: "extFiles",
      metaData: "metaData",
      region: "regions"
    }[child.nodeName];

    // if child is array, save the values as array, else as strings.
    if (asArray && json[arrayChildName] === undefined) {
      json[arrayChildName] = [convertCaamlToJson(child)];
    } else if (asArray) {
      json[arrayChildName].push(convertCaamlToJson(child));
    } else if (json[child.nodeName] !== undefined) {
      console.warn(
        `${child.nodeName} is already present!`,
        json[child.nodeName]
      );
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
        ...(albina?.forenoon?.dangerRatings?.map(r => r.mainValue) || []),
        ...(albina?.afternoon?.dangerRatings?.map(r => r.mainValue) || [])
      ].reduce((r1, r2) =>
        getWarnlevelNumber(r1) > getWarnlevelNumber(r2) ? r1 : r2
      );
      return albina;
    })
    .filter(bulletin => !!bulletin);
}
