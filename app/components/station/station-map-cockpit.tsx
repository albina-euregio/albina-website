import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "../../i18n";
import {
  AVAILABLE_PARAMETERS,
  type ParameterType
} from "./station-parameter-data";

interface StationMapCockpitProps {
  selectedParameter: ParameterType;
  onParameterChange: (parameterId: ParameterType) => void;
}

const PARAMETER_ICON_CLASSES: Partial<Record<ParameterType, string>> = {
  HS: "icon-snow",
  HSD_24: "icon-snow-diff",
  HSD_48: "icon-snow-diff",
  HSD_72: "icon-snow-diff",
  TA: "icon-temperature",
  TSS: "icon-temperature",
  PSUM_24: "icon-snow-drop",
  RH: "icon-snow-drop",
  VW: "icon-wind",
  VW_MAX: "icon-wind-gust"
};

const StationMapCockpit: React.FC<StationMapCockpitProps> = ({
  selectedParameter,
  onParameterChange
}) => {
  const intl = useIntl();
  const [lastRedraw, setLastRedraw] = useState(+new Date());

  useEffect(() => {
    const handleResize = () => setLastRedraw(+new Date());
    window.addEventListener("resize", handleResize);
    document?.querySelector("body").classList.remove("layer-selector-open");
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeParameter =
    AVAILABLE_PARAMETERS.find(param => param.id === selectedParameter) ||
    AVAILABLE_PARAMETERS[0];

  const legendItems = useMemo(() => {
    const thresholds = activeParameter.thresholds;
    const colors = Object.values(activeParameter.colors);
    const lastThreshold = thresholds[thresholds.length - 1];

    return colors.map((color, index) => {
      let label = "0";
      if (index === 1 && thresholds[0] < 0) {
        label = `<${thresholds[0]}`;
      } else if (index === colors.length - 1) {
        label = `>${lastThreshold}`;
      } else if (index > 0) {
        label = `${thresholds[index - 1]}`;
      }

      return (
        <span
          key={`station-legend-item-${index}`}
          data-label={label}
          style={{
            backgroundColor: `rgb(${color.join(",")})`,
            width: `${100 / colors.length}%`
          }}
        ></span>
      );
    });
  }, [activeParameter]);

  const parameterButtons = AVAILABLE_PARAMETERS.map(param => {
    const iconClass = PARAMETER_ICON_CLASSES[param.id];
    const spanClasses = ["layer-select"];
    if (iconClass) spanClasses.push(iconClass);

    return (
      <a
        key={param.id}
        href="#"
        className={`cp-layer-selector-item ${param.id === selectedParameter ? "js-active" : ""}`}
        onClick={event => {
          event.preventDefault();
          onParameterChange(param.id);
          document
            ?.querySelector("body")
            .classList.remove("layer-selector-open");
        }}
      >
        <div className={spanClasses.join(" ")}>
          <span className="layer-select-text">
            <span className="layer-select-name">
              {intl.formatMessage({ id: param.label })}
            </span>
            <span className="layer-select-info">{param.unit}</span>
          </span>
        </div>
      </a>
    );
  });

  const classes = [
    "map-cockpit",
    "weather-map-cockpit",
    "station-map-cockpit",
    "lastRedraw-" + lastRedraw
  ];

  const activeIconClass = PARAMETER_ICON_CLASSES[activeParameter.id];
  const activeSpanClasses = ["layer-select"];
  if (activeIconClass) activeSpanClasses.push(activeIconClass);

  return (
    <div role="button" className={classes.join(" ")}>
      <div className="cp-container-1">
        <div className="cp-layer-selector">{parameterButtons}</div>
      </div>

      <div className="cp-container-2">
        <div className="cp-container-layer-range">
          <div className="cp-layer" style={{ width: "100%" }}>
            <a
              href="#"
              role="button"
              tabIndex={0}
              className="cp-layer-selector-item cp-layer-trigger"
              onClick={event => {
                event.preventDefault();
                document
                  ?.querySelector("body")
                  .classList.toggle("layer-selector-open");
              }}
            >
              <div className={activeSpanClasses.join(" ")}>
                <span className="layer-select-text">
                  <span className="layer-select-name">
                    {intl.formatMessage({ id: activeParameter.label })}
                  </span>
                  <span className="layer-select-info">
                    <span className="layer-select-info">
                      {activeParameter.unit}
                    </span>
                  </span>
                </span>
              </div>
              <span className="layer-trigger"></span>
            </a>
          </div>
        </div>

        <div className="cp-container-legend-release">
          <div className="cp-legend">
            <div className="cp-legend-items station-legend-items">
              {legendItems}
            </div>
          </div>
          <div key="cp-release" className="cp-release">
            <span className="cp-release-released">
              {intl.formatMessage({ id: "measurements:note" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMapCockpit;
