import { useStore } from "@nanostores/react";
import React from "react";
import { $router, redirectPageQuery } from "../router";
import Modal from "./albina-modal";
import WeatherStationDiagrams, { type Props } from "./weather-station-diagrams";

export function useStationId() {
  const router = useStore($router);
  return [
    router?.search?.station ?? "",
    (station: string) => redirectPageQuery({ station })
  ] as const;
}

export const WeatherStationDialog: React.FC<Props> = props => (
  <Modal
    isOpen={!!props.stationId}
    onClose={() => props.setStationId("")}
    width={"90vw"}
  >
    {!!props.stationId && <WeatherStationDiagrams {...props} />}
  </Modal>
);

export default WeatherStationDialog;
