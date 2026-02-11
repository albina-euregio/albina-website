import React from "react";
import { useIntl } from "../../i18n";
import "./station-parameter-control.css";

export interface ParameterOption {
  id: string;
  label: string;
  unit: string;
  thresholds: number[];
  colors: Record<number, [number, number, number]>;
  direction?: string | false;
}

export const AVAILABLE_PARAMETERS: ParameterOption[] = [
  {
    id: "HS",
    label: "weathermap:domain:title:snow-height",
    unit: "cm",
    thresholds: [1, 10, 25, 50, 100, 200, 300, 400],
    colors: {
      1: [255, 255, 254],
      2: [255, 255, 179],
      3: [176, 255, 188],
      4: [140, 255, 255],
      5: [3, 205, 255],
      6: [4, 129, 255],
      7: [3, 91, 190],
      8: [120, 75, 255],
      9: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_24",
    label: "weathermap:domain:title:diff-snow24h",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_48",
    label: "weathermap:domain:title:diff-snow48h",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_72",
    label: "weathermap:domain:title:diff-snow72h",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "TA",
    label: "weathermap:domain:title:temp",
    unit: "°C",
    thresholds: [-20, -10, -5, 0, 5, 10, 15, 20],
    colors: {
      1: [0, 0, 255],
      2: [100, 150, 255],
      3: [150, 200, 255],
      4: [200, 230, 255],
      5: [255, 255, 200],
      6: [255, 200, 100],
      7: [255, 150, 50],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: false
  },
  {
    id: "TSS",
    label: "weathermap:domain:title:snowSurfaceTemp",
    unit: "°C",
    thresholds: [-20, -10, -5, 0, 5, 10, 15, 20],
    colors: {
      1: [0, 0, 255],
      2: [100, 150, 255],
      3: [150, 200, 255],
      4: [200, 230, 255],
      5: [255, 255, 200],
      6: [255, 200, 100],
      7: [255, 150, 50],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: false
  },
  {
    id: "PSUM_24",
    label: "weathermap:domain:title:precipitation24h",
    unit: "mm",
    thresholds: [1, 5, 10, 15, 20, 30, 50, 75],
    colors: {
      1: [255, 255, 254],
      2: [200, 230, 255],
      3: [150, 200, 255],
      4: [100, 150, 255],
      5: [50, 100, 255],
      6: [0, 50, 200],
      7: [0, 0, 150],
      8: [0, 0, 100],
      9: [0, 0, 50]
    },
    direction: false
  },
  {
    id: "RH",
    label: "weathermap:domain:title:relative-humidity",
    unit: "%",
    thresholds: [20, 30, 40, 50, 60, 70, 80, 90],
    colors: {
      1: [255, 200, 100],
      2: [255, 230, 150],
      3: [255, 255, 200],
      4: [230, 255, 230],
      5: [200, 255, 255],
      6: [150, 200, 255],
      7: [100, 150, 255],
      8: [50, 100, 200],
      9: [0, 50, 150]
    },
    direction: false
  },
  {
    id: "VW",
    label: "weathermap:domain:title:wind",
    unit: "km/h",
    thresholds: [5, 10, 20, 30, 40, 50, 60, 70],
    colors: {
      1: [255, 255, 254],
      2: [230, 255, 230],
      3: [200, 255, 200],
      4: [150, 255, 150],
      5: [255, 255, 100],
      6: [255, 200, 50],
      7: [255, 150, 0],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: "DW"
  },
  {
    id: "VW_MAX",
    label: "weathermap:domain:title:gust",
    unit: "km/h",
    thresholds: [5, 10, 20, 30, 40, 50, 60, 70],
    colors: {
      1: [255, 255, 254],
      2: [230, 255, 230],
      3: [200, 255, 200],
      4: [150, 255, 150],
      5: [255, 255, 100],
      6: [255, 200, 50],
      7: [255, 150, 0],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: "DW"
  }
];

interface StationParameterControlProps {
  selectedParameter: string;
  onParameterChange: (parameterId: string) => void;
}

const StationParameterControl: React.FC<StationParameterControlProps> = ({
  selectedParameter,
  onParameterChange
}) => {
  const intl = useIntl();

  return (
    <div className="station-parameter-control">
      <label htmlFor="parameter-select">
        {intl.formatMessage({ id: "weathermap:parameter:label" as any })}:{" "}
      </label>
      <select
        id="parameter-select"
        value={selectedParameter}
        onChange={e => onParameterChange(e.target.value)}
        className="parameter-select"
      >
        {AVAILABLE_PARAMETERS.map(param => (
          <option key={param.id} value={param.id}>
            {intl.formatMessage({ id: param.label as any })} [{param.unit}]
          </option>
        ))}
      </select>
    </div>
  );
};

export default StationParameterControl;
