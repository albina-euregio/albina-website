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
      "dangerRating",
      "extFile",
      "metaData",
      "region"
    ];
    const asArray =
      // checking if child has siblings of same name.
      children.some(i => i !== child && i.nodeName === child.nodeName) ||
      // or child name is forced to be an array
      forceArray.includes(child.nodeName);

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
 * @param {XMLDocument} document
 * @returns {Bulletin.Bulletin} bulletin
 */
export function convertCaamlToAlbinaJson(document) {
  const json = convertCaamlToJson(document);
  const { observations } = json.ObsCollection;
  /**
   * @type {Bulletin.Bulletin[]}
   */
  const albinaObservations = [];
  observations.map(observation => {
    const { id, lang, metaDataProperty, validTime } = observation;
    const {
      dangerRatings,
      dangerPatterns,
      avProblems,
      avActivityHighlights,
      avActivityComment,
      Tendency,
      snowpackStructureComment,
      tendencyComment
    } = observation.bulletinResultsOf[0];

    const hasElevationDependency =
      dangerRatings.length === 1 ||
      dangerRatings[0].mainValue !== dangerRatings[1].mainValue;
    const getIsTreeline = (validElevation, lwHi) =>
      typeof validElevation === "string" &&
      (!lwHi || validElevation.match(lwHi)) &&
      !!validElevation.match(/^ElevationRange_Treeline/);
    const getElevation = (validElevation, lwHi) => {
      let value;
      if (typeof validElevation === "string") {
        const match =
          (!lwHi || validElevation.match(lwHi)) &&
          validElevation.match(/^ElevationRange_(\d+)/);
        if (match) value = match[1];
      } else if (typeof validElevation === "object") {
        const { elevationRange } = validElevation;
        if (elevationRange && lwHi && lwHi.test("Lw")) {
          // deal with typo "begionPosition" in old CAAML files, see https://gitlab.com/albina-euregio/albina-server/-/commit/d9b7c5d998a9f932f6b34c62d2b8df96d2ec4f39
          value = elevationRange.beginPosition || elevationRange.begionPosition;
        } else if (elevationRange && lwHi && lwHi.test("Hi")) {
          value = elevationRange.endPosition;
        }
      }
      return typeof value === "string" ? parseInt(value, 10) : undefined;
    };
    const getDangerRatingNumber = lwHi =>
      dangerRatings.find(r => !r.validElevation || r.validElevation.match(lwHi))
        ?.mainValue;
    const getWarnLevelId = number => window["appStore"].getWarnLevelId(number);
    const getDangerPattern = index =>
      dangerPatterns?.[index]?.type.toLowerCase();
    /**
     * @param {number} index
     * @returns {Bulletin.AvalancheSituation} situation
     */
    const getAvalancheSituation = index => {
      if (!avProblems[index]) return undefined;
      const { type, validAspect, validElevation } = avProblems[index];
      const typeMapping = {
        "new snow": "new_snow",
        "drifting snow": "wind_drifted_snow",
        "old snow": "weak_persistent_layer",
        "wet snow": "wet_snow",
        "gliding snow": "gliding_snow",
        "favourable situation": "favourable_situation"
      };
      return {
        elevationLow: getElevation(validElevation, /Hi$/), // Low→Hi sic!
        elevationHigh: getElevation(validElevation, /Lw$/), // Low→Hi sic!
        treelineLow: getIsTreeline(validElevation, /Hi$/), // Low→Hi sic!
        treelineHigh: getIsTreeline(validElevation, /Lw$/), // High→Lw sic!
        avalancheSituation: typeMapping[type],
        aspects: validAspect
          ? validAspect.map(a => a.replace(/^AspectRange_/, ""))
          : undefined
      };
    };
    const validity = {
      from: validTime.TimePeriod.beginPosition,
      until: validTime.TimePeriod.endPosition
    };
    const forenoon = {
      id,
      dangerRatingBelow: getWarnLevelId(getDangerRatingNumber(/Lw$/)),
      dangerRatingAbove: getWarnLevelId(getDangerRatingNumber(/Hi$/)),
      avalancheSituation1: getAvalancheSituation(0),
      avalancheSituation2: getAvalancheSituation(1)
    };
    const maxWarnlevel = [
      getDangerRatingNumber(/Lw$/),
      getDangerRatingNumber(/Hi$/)
    ]
      .filter(s => typeof s === "string" && s.match(/[12345]/))
      .map(s => +s)
      .reduce(Math.max, 0);

    // merge afternoon into forenoon observation
    if (id.match(/_PM$/)) {
      const afternoon = forenoon;
      afternoon.id = afternoon.id.replace(/_PM$/, "");
      const forenoonObs = albinaObservations.find(o => o.id === afternoon.id);
      forenoonObs.validity.until = validity.until;
      forenoonObs.hasElevationDependency |= hasElevationDependency;
      forenoonObs.hasDaytimeDependency = true;
      forenoonObs.afternoon = afternoon;
      forenoonObs.maxWarnlevel.number = Math.max(
        forenoonObs.maxWarnlevel.number,
        maxWarnlevel
      );
      forenoonObs.maxWarnlevel.id = getWarnLevelId(
        forenoonObs.maxWarnlevel.number
      );
      return;
    }

    albinaObservations.push({
      id,
      publicationDate: metaDataProperty[0].dateTimeReport,
      validity,
      regions: observation.locRef,
      treeline: getIsTreeline(dangerRatings?.[0]?.validElevation),
      elevation: getElevation(dangerRatings?.[1]?.validElevation),
      hasElevationDependency,
      maxWarnlevel: {
        number: maxWarnlevel,
        id: getWarnLevelId(maxWarnlevel)
      },
      forenoon,
      hasDaytimeDependency: false,
      afternoon: undefined,
      tendency: Tendency ? Tendency.type : undefined,
      dangerPattern1: getDangerPattern(0),
      dangerPattern2: getDangerPattern(1),
      avActivityHighlights: avActivityHighlights && [
        {
          text: avActivityHighlights.replace(/&lt;br\/&gt;/g, "<br/>"),
          languageCode: lang
        }
      ],
      avActivityComment: avActivityComment && [
        {
          text: avActivityComment.replace(/&lt;br\/&gt;/g, "<br/>"),
          languageCode: lang
        }
      ],
      snowpackStructureComment: snowpackStructureComment && [
        {
          text: snowpackStructureComment.replace(/&lt;br\/&gt;/g, "<br/>"),
          languageCode: lang
        }
      ],
      tendencyComment: tendencyComment && [
        {
          text: tendencyComment.replace(/&lt;br\/&gt;/g, "<br/>"),
          languageCode: lang
        }
      ]
    });
  });
  return albinaObservations;
}
