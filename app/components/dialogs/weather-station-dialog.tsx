import React from "react";
import Modal from "./albina-modal";
import WeatherStationDiagrams, { type Props } from "./weather-station-diagrams";

export const WeatherStationDialog: React.FC<Props> = props => (
  <Modal isOpen={!!props.stationId} onClose={() => props.setStationId("")}>
    {!!props.stationId && <WeatherStationDiagrams {...props} />}
  </Modal>
);

export default WeatherStationDialog;
