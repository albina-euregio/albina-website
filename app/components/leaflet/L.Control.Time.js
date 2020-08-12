L.Control.TimeSelector = L.Control.extend({
  options: {
    /** Position of the control */
    position: "topright",
    eventCallback: undefined,
    startDate: null,
    timeArray: [],
    buttonBaseClasses: "leaflet-bar-part leaflet-bar-part-single",
    strings: {}
  },
  initialize: function(options) {
    L.Util.setOptions(this, options);
    // Continue initializing the control plugin here.
  },

  onAdd: function(map) {
    console.log("TimeSelector->onAdd:", this.options.timeArray);
    let container = L.DomUtil.create(
      "div",
      "leaflet-control-locate leaflet-bar leaflet-control"
    );
    container.innerHTML = "this is a test";
    this._container = container;
    this._createButtons(
      container,
      this.options.timeArray,
      this.options.startDate,
      this.options.buttonBaseClasses,
      this.options.eventCallback
    );

    return container;
  },

  onRemove: function(map) {
    // Nothing to do here
  },
  _createButtons: function(
    container,
    timeArray,
    startDate,
    buttonBaseClasses,
    eventCallback
  ) {
    console.log("TimeSelector->_createButtons:", timeArray);
    timeArray.forEach(aTime => {
      let buttonClass = "leaflet-bar-part leaflet-bar-part-single";
      if (aTime < startDate) buttonClass = "future";
      this._createButton(
        container,
        aTime,
        aTime,
        buttonBaseClasses + " " + buttonClass,
        eventCallback
      );
    });
  },
  _createButton: function(container, title, id, classNames, eventCallback) {
    let button = L.DomUtil.create("a", classNames, container);
    button.title = title;
    button.innerHTML = title;
    button.role = "button";
    button.href = "javascript: void(0)";

    L.DomEvent.on(button, "click", L.DomEvent.stopPropagation);
    L.DomEvent.on(button, "click", () => eventCallback(id));
    L.DomEvent.on(button, "dblclick", L.DomEvent.stopPropagation);
    return button;
  }
});

export default L.control.timeSelector = function(opts) {
  return new L.Control.TimeSelector(opts);
};
