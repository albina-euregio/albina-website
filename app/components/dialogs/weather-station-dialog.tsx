import React from "react";
import { type ForwardedRef, forwardRef } from "react";
import WeatherStationDiagrams from "./weather-station-diagrams";

const WeatherStationDialog = forwardRef(function WeatherStationDialog(
  props,
  ref: ForwardedRef<HTMLDialogElement>
) {
  return (
    <dialog
      ref={ref}
      onClick={function (e) {
        return e.target == ref.current && ref.current.close();
      }}
    >
      <form method="dialog">
        <WeatherStationDiagrams isOpen={() => ref.current.open} />
      </form>
    </dialog>
  );
});

export default WeatherStationDialog;
