/*
  markerCluster placement-strategies subplugin for leaflet.markercluster
  https://github.com/adammertel/Leaflet.MarkerCluster.PlacementStrategies
  Adam Mertel | univie
*/

import L from "leaflet";

L.MarkerCluster.include({
  spiderfy: function a() {
    if (this._group._spiderfied === this || this._group._inZoomAnimation) {
      return;
    }
    var b = this.getAllChildMarkers();
    var c = this._group;
    var d = c._map;
    var e = d.latLngToLayerPoint(this._latlng);
    var f = [];
    for (var g in b) {
      if (b[g].setStyle) {
        b[g].setStyle({ className: "clustered-element" });
      }
    }
    this._group._unspiderfy();
    this._group._spiderfied = this;
    this._clockHelpingGeometries = [];
    switch (this._group.options.elementsPlacementStrategy) {
      case "default":
        if (b.length >= this._circleSpiralSwitchover) {
          f = this._generatePointsSpiral(b.length, e);
        } else {
          f = this._generatePointsCircle(b.length, e);
        }
        break;
      case "spiral":
        f = this._generatePointsSpiral(b.length, e);
        break;
      case "one-circle":
        f = this._generatePointsCircle(b.length, e);
        break;
      case "concentric":
        f = this._generatePointsConcentricCircles(b.length, e);
        break;
      case "clock":
        f = this._generatePointsClocksCircles(b.length, e, false);
        break;
      case "clock-concentric":
        f = this._generatePointsClocksCircles(b.length, e, true);
        break;
      case "original-locations":
        f = this._getOriginalLocations(b, this._group._map);
        break;
      default:
    }
    this._animationSpiderfy(b, f);
  },
  unspiderfy: function a(b) {
    if (this._group._inZoomAnimation) {
      return;
    }
    this._animationUnspiderfy(b);
    if (this._group.options.helpingCircles) {
      this._removeClockHelpingCircles(this._group._featureGroup);
    }
    this._group._spiderfied = null;
  },
  _generatePointsCircle: function a(b, c) {
    var d =
        this._group.options.spiderfyDistanceMultiplier *
        this._circleFootSeparation *
        (2 + b),
      e = d / this._2PI,
      f = this._2PI / b,
      g = [];
    var h = void 0,
      i = void 0;
    g.length = b;
    for (h = b - 1; h >= 0; h--) {
      i = this._circleStartAngle + h * f;
      g[h] = new L.Point(c.x + e * Math.cos(i), c.y + e * Math.sin(i))._round();
    }
    return g;
  },
  _generatePointsSpiral: function a(b, c) {
    var d = this._group.options.spiderfyDistanceMultiplier,
      e = d * this._spiralFootSeparation,
      f = d * this._spiralLengthFactor * this._2PI,
      g = [];
    var h = void 0,
      i = 0;
    var j = d * this._spiralLengthStart;
    g.length = b;
    for (h = b - 1; h >= 0; h--) {
      i += e / j + h * 0.0005;
      g[h] = new L.Point(c.x + j * Math.cos(i), c.y + j * Math.sin(i))._round();
      j += f / i;
    }
    return g;
  },
  _regularPolygonVertexPlacement: function a(b, c, d, e) {
    var f = this._2PI / c;
    var g = f * b;
    if (c !== 2) {
      g -= 1.6;
    }
    return new L.Point(d.x + Math.cos(g) * e, d.y + Math.sin(g) * e)._round();
  },
  _generatePointsClocksCircles: function a(b, c, d) {
    var e = [];
    var f = this._group.options.firstCircleElements;
    var g = this._circleFootSeparation * 1.5 + 10,
      h = this._group.options.spiderfyDistanceMultiplier,
      j = this._group.options.spiderfyDistanceSurplus,
      k = this._group.options.elementsMultiplier;

    var l = 1,
      m = f,
      n = g,
      o = 0;
    this._createHelpingCircle(c, n);
    for (var p = 1; p <= b; p++) {
      var i = p - o;
      if (i > m) {
        l += 1;
        o += m;
        i = p - o;
        m = Math.floor(m * k);
        n = (j + n) * h;
        this._createHelpingCircle(c, n);
      }
      if (d && l === 1) {
        e[p - 1] = this._regularPolygonVertexPlacement(
          i - 1,
          Math.min(f, b),
          c,
          n
        );
      } else {
        e[p - 1] = this._regularPolygonVertexPlacement(i - 1, m, c, n);
      }
    }
    return e;
  },
  _createHelpingCircle: function a(b, c) {
    if (this._group.options.helpingCircles) {
      var d = { radius: c };
      if (!this._group.options.clockHelpingCircleOptions.fill) {
        this._group.options.clockHelpingCircleOptions.fillColor = "none";
      }
      L.extend(d, this._group.options.clockHelpingCircleOptions);
      var e = new L.CircleMarker(this._group._map.layerPointToLatLng(b), d);
      this._group._featureGroup.addLayer(e);
      this._clockHelpingGeometries.push(e);
    }
  },
  _generatePointsConcentricCircles: function a(b, d) {
    var e = this;
    var c = [];
    var f = this._group.options.firstCircleElements,
      g = this._circleFootSeparation * 1.5,
      h = this._group.options.spiderfyDistanceMultiplier,
      j = this._group.options.elementsMultiplier,
      k = this._group.options.spiderfyDistanceSurplus,
      l = Math.round(f * j);
    var m = [
      { distance: g, noElements: 0 },
      { distance: (k + g) * h, noElements: 0 },
      { distance: (2 * k + g) * h * h, noElements: 0 },
      { distance: (3 * k + g) * h * h * h, noElements: 0 }
    ];
    if (b > f) {
      m[1].noElements = l;
      if ((f < b && b < 2 * f) || (f + l < b && b < 2 * f + l)) {
        m[1].noElements = f;
      }
    }
    if (b > f + Math.round(f * j)) {
      m[2].noElements = Math.round(f * j);
    }
    if (b > f + 2 * Math.round(f * j)) {
      m[2].noElements = Math.round(f * j * j);
    }
    if (b > f + Math.round(f * j) + Math.round(f * j * j)) {
      m[2].noElements = Math.round(f * j);
    }
    if (b > f + 2 * Math.round(f * j) + Math.round(f * j * j)) {
      m[2].noElements = Math.round(f * j * j);
    }
    m[0].noElements = Math.min(b - m[1].noElements - m[2].noElements, f);
    m[3].noElements = Math.max(
      b - m[0].noElements - m[1].noElements - m[2].noElements,
      0
    );
    var n = 0;
    var o = m[0];
    for (var p = 1; p <= b; p++) {
      if (m[1].noElements > 0) {
        if (p > m[0].noElements) {
          o = m[1];
          n = m[0].noElements;
        }
        if (p > m[0].noElements + m[1].noElements && m[2].noElements > 0) {
          o = m[2];
          n = m[0].noElements + m[1].noElements;
        }
        if (
          p > m[0].noElements + m[1].noElements + m[2].noElements &&
          m[3].noElements > 0
        ) {
          o = m[3];
          n = m[0].noElements - m[1].noElements - m[2].noElements;
        }
      }
      c[p - 1] = this._regularPolygonVertexPlacement(
        p - n,
        o.noElements,
        d,
        o.distance
      );
    }
    m.filter(function(a) {
      return a.noElements;
    }).map(function(a) {
      return e._createHelpingCircle(d, a.distance);
    });
    return c;
  },
  _removeClockHelpingCircles: function a(b) {
    for (var c in this._clockHelpingGeometries) {
      b.removeLayer(this._clockHelpingGeometries[c]);
    }
  },
  _getOriginalLocations: function a(b, c) {
    var d = [];
    b.forEach(function(a) {
      d.push(c.latLngToLayerPoint(a.getLatLng()));
    });
    return d;
  }
});
("use strict");
L.MarkerClusterGroup.include({
  options: {
    maxClusterRadius: 80,
    iconCreateFunction: null,
    clusterPane: L.Marker.prototype.options.pane,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    singleMarkerMode: false,
    disableClusteringAtZoom: null,
    removeOutsideVisibleBounds: true,
    elementsPlacementStrategy: "clock-concentric",
    firstCircleElements: 10,
    elementsMultiplier: 1.5,
    spiderfyDistanceSurplus: 30,
    helpingCircles: true,
    clockHelpingCircleOptions: {
      color: "grey",
      dashArray: 5,
      fillOpacity: 0,
      opacity: 0.5,
      weight: 3
    },
    animate: false,
    animateAddingMarkers: false,
    spiderfyDistanceMultiplier: 1,
    spiderLegPolylineOptions: { weight: 1.5, color: "#222", opacity: 0.5 },
    chunkedLoading: false,
    chunkInterval: 200,
    chunkDelay: 50,
    chunkProgress: null,
    polygonOptions: {}
  }
});
