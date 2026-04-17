import React from "react";
import { useIntl } from "../../i18n";
import {
  AVAILABLE_PARAMETERS,
  type ParameterType,
  type ParameterOption
} from "./station-parameter-data";
import "./station-parameter-control.css";

export type { ParameterType, ParameterOption };
export { AVAILABLE_PARAMETERS };

interface StationParameterControlProps {
  selectedParameter: ParameterType;
  onParameterChange: (parameterId: ParameterType) => void;
}

const StationParameterControl: React.FC<StationParameterControlProps> = ({
  selectedParameter,
  onParameterChange
}) => {
  const intl = useIntl();

  return (
    <div className="station-parameter-control">
      <label htmlFor="parameter-select">
        {intl.formatMessage({ id: "weathermap:parameter:label" })}:{" "}
      </label>
      <select
        id="parameter-select"
        value={selectedParameter}
        onChange={e => onParameterChange(e.target.value as ParameterType)}
        className="parameter-select"
      >
        {AVAILABLE_PARAMETERS.map(param => (
          <option key={param.id} value={param.id}>
            {intl.formatMessage({ id: param.label })} [{param.unit}]
          </option>
        ))}
      </select>
    </div>
  );
};

export default StationParameterControl;
