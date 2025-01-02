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

interface Parameter {
  id: ParameterType;
  stroke: string;
  label: string;
  axis?: uPlot.Axis;
  scales?: uPlot.Scales;
}

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
        cursor: { sync: { key: "shieshaesh7loo6sho2Daghah0Agohzu" } },
        axes: [
          {
            values: (_, vs) =>
              vs.map(v => {
                const date = new Date(v * 1000);
                return date.getHours() == 0
                  ? intl.formatDate(date, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit"
                    })
                  : intl.formatDate(date, {
                      hour: "2-digit",
                      minute: "2-digit"
                    });
              })
          },
          parameters[0]?.axis ?? {
            label: `${parameters[0].label} [${unit}]`,
            labelGap: 10,
            values: (_, vs) => vs.map(v => intl.formatNumber(v, {}))
          }
        ],
        scales: parameters[0]?.scales,
        series: [
          {
            label: "Time",
            // uPlot uses epoch seconds (instead of milliseconds)
            value: (_, v) =>
              intl.formatDate(new Date(v * 1000), {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })
          },
          ...parameters.map(
            (p): uPlot.Series => ({
              label: p.label,
              value: (_, v) => intl.formatNumberUnit(v, unit, 1),
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

const UNIT_MAPPING: Record<
  string,
  { to: string; convert: (v: number) => number }
> = {
  K: { to: "°C", convert: v => v - 273.15 },
  m: { to: "cm", convert: v => v * 100 },
  "m/s": { to: "km/h", convert: v => v * 3.6 }
};

function parseData(
  smet: string,
  parameters: Parameter[],
  timeRangeMilli: number,
  setUnit: (unit: string) => void
): uPlot.AlignedData {
  // https://code.wsl.ch/snow-models/meteoio/-/blob/master/doc/SMET_specifications.pdf
  let index = [] as number[];
  let units = [] as string[];
  let nodata = "-777";
  const timestamps: number[] = [];
  const values: number[][] = parameters.map(() => []);
  smet.split(/\r?\n/).forEach(line => {
    if (line.startsWith("fields =")) {
      const fields = line.slice("fields =".length).trim().split(" ");
      index = parameters.map(p => fields.indexOf(p.id));
      return;
    } else if (line.startsWith("#units =") && index[0] >= 0) {
      units = line.slice("#units =".length).trim().split(" ");
      return;
    } else if (line.startsWith("nodata =")) {
      nodata = line.slice("nodata =".length).trim();
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
    index.forEach((i, k) => {
      if (i < 0) return;
      const value = cells[i] === nodata ? NaN : +cells[i].replace(",", ".");
      values[k].push(UNIT_MAPPING[units[i]]?.convert(value) ?? value);
    });
  });
  setUnit(
    units
      .map(u => UNIT_MAPPING[u]?.to ?? u)
      .filter((u, i, array) => index.includes(i) && array.indexOf(u) === i)
      .join()
  );
  return [timestamps, ...values];
}
