import React, { useEffect, useState } from "react";
import type uPlot from "uplot";
import UplotReact from "uplot-react";
import { useIntl } from "../../i18n";
import type { StationData } from "../../stores/stationDataStore";
import "uplot/dist/uPlot.min.css";

// P Air pressure, in Pa
// TA Temperature Air, in Kelvin
// TD Temperature Dew Point, in Kelvin
// TSS Temperature Snow Surface, in Kelvin
// TSG Temperature Surface Ground, in Kelvin
// RH Relative Humidity, between 0 and 1
// VW_MAX Maximum wind velocity, in m/s
// VW Velocity Wind, in m/s
// DW Direction Wind, in degrees, clockwise and north being zero degrees
// ISWR Incoming Short Wave Radiation, in W/m2
// RSWR Reflected Short Wave Radiation, in W/m2 (previously OSWR)
// ILWR Incoming Long Wave Radiation, in W/m2
// OLWR Outgoing Long Wave Radiation, in W/m2
// PINT Precipitation Intensity, in mm/h, as an average over the timestep
// PSUM Precipitation accumulation, in mm, summed over the last timestep
// HS Height Snow, in m
type ParameterType =
  | "P"
  | "TA"
  | "TD"
  | "TSS"
  | "TSG"
  | "RH"
  | "VW_MAX"
  | "VW"
  | "DW"
  | "ISWR"
  | "RSWR"
  | "ILWR"
  | "OLWR"
  | "PINT"
  | "PSUM"
  | "HS";

type Parameter = {
  id: ParameterType;
  stroke: string;
  label: string;
};

const WeatherStationUplot: React.FC<{
  stationData: StationData;
  parameters: Parameter[];
  timeRangeMilli: number;
  height: number;
  width: number;
}> = ({ stationData, parameters, timeRangeMilli, height, width }) => {
  const intl = useIntl();
  const [data, setData] = useState<uPlot.AlignedData>([[], []]);
  const [unit, setUnit] = useState("");
  const id = stationData.properties["LWD-Nummer"];
  const url = `https://api.avalanche.report/lawine/grafiken/smet/woche/${id}.smet.gz`;

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(smet => parseData(smet, parameters, timeRangeMilli, setUnit))
      .then(data => setData(data));
  }, [parameters, timeRangeMilli, url]);

  if (!data[0].length) return <></>;

  return (
    <UplotReact
      data={data}
      options={{
        width,
        height,
        axes: [
          {
            values: "{YYYY}-{MM}-{DD}\n{HH}:{mm}"
          },
          {
            label: parameters[0].label,
            incrs: parameters[0].id === "DW" ? [90] : undefined,
            labelGap: 10,
            values: (_, vs) =>
              vs.map(v => intl.formatNumber(v, {}) + " " + unit)
          }
        ],
        series: [
          {
            label: "Time",
            // uPlot uses epoch seconds (instead of milliseconds)
            //value: (_, v) => intl.formatDate(v * 1000, DATE_TIME_ZONE_FORMAT)
            value: "{YYYY}-{MM}-{DD} {HH}:{mm}"
          },
          ...parameters.map(
            (p): uPlot.Series => ({
              label: p.label,
              value: (_, v) =>
                intl.formatNumber(v, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                }) +
                " " +
                unit,
              stroke: p.stroke,
              points:
                p.id === "DW"
                  ? { size: 3, stroke: p.stroke, show: true }
                  : undefined,
              width: p.id === "DW" ? 0 : undefined
            })
          )
        ]
      }}
    />
  );
};

export default WeatherStationUplot;

function parseData(
  smet: string,
  parameters: Parameter[],
  timeRangeMilli: number,
  setUnit: (unit: string) => void
): uPlot.AlignedData {
  // https://code.wsl.ch/snow-models/meteoio/-/blob/master/doc/SMET_specifications.pdf
  let index = [] as number[];
  const timestamps: number[] = [];
  const values: number[][] = parameters.map(() => []);
  smet.split(/\r?\n/).forEach(line => {
    if (line.startsWith("fields =")) {
      const fields = line.slice("fields =".length).trim().split(" ");
      index = parameters.map(p => fields.indexOf(p.id));
      return;
    } else if (line.startsWith("#units =") && index[0] >= 0) {
      const units = line.slice("#units =".length).trim().split(" ");
      setUnit(units[index[0]]);
      return;
    } else if (!/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.test(line)) {
      return;
    } else if (index[0] < 0) {
      return;
    }
    const cells = line.split(" ");
    const date = Date.parse(cells[0]);
    if (Date.now() - date > timeRangeMilli) return;
    // uPlot uses epoch seconds (instead of milliseconds)
    timestamps.push(date / 1000);
    index.forEach(
      (i, k) => i < 0 || values[k].push(+cells[i].replace(",", "."))
    );
  });
  return [timestamps, ...values];
}
