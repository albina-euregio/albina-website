import { useStore } from "@nanostores/react";
import React, { Suspense } from "react";
import { $router, redirectPageQuery } from "../router";
import Modal from "../dialogs/albina-modal";
import type { Props } from "./station-diagrams";

const WeatherStationDiagrams = React.lazy(() => import("./station-diagrams"));

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
    <Suspense fallback={"..."}>
      {!!props.stationId && <WeatherStationDiagrams {...props} />}
    </Suspense>
  </Modal>
);

export default WeatherStationDialog;
