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
  label: string;
  digits?: 0 | 1 | 2;
} & uPlot.Series;

const WeatherStationUplot: React.FC<{
  title: string;
  axes: uPlot.Axis[];
  scales: uPlot.Scales;
  hooks?: uPlot.Hooks.Arrays;
  stationData: StationData;
  parameters: Parameter[];
  timeRangeMilli: number;
  height: number;
  width: number;
}> = ({
  title,
  axes,
  scales,
  hooks,
  stationData,
  parameters,
  timeRangeMilli,
  height,
  width
}) => {
  const intl = useIntl();
  const [data, setData] = useState<uPlot.AlignedData>([[], []]);
  const id = stationData.properties?.["LWD-Nummer"] || stationData.id;
  const timeRange = timeRangeMilli > 7 * 24 * 3600e3 ? "winter" : "woche";
  const url = `https://api.avalanche.report/lawine/grafiken/smet/${timeRange}/${id}.smet.gz`;

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(smet => parseData(smet, parameters, timeRangeMilli, () => {}))
      .then(data => setData(data));
  }, [parameters, timeRangeMilli, url]);

  if (!data[0].length) return <></>;

  return (
    <UplotReact
      data={data}
      options={{
        title,
        hooks,
        width,
        height,
        cursor: { sync: { key: "shieshaesh7loo6sho2Daghah0Agohzu" } },
        legend: {
          show: true,
          live: true,
          fill: (u, seriesIdx) => u.series[seriesIdx].stroke(u, seriesIdx),
          markers: {
            fill: (u, seriesIdx) => u.series[seriesIdx].stroke(u, seriesIdx)
          }
        },
        axes: [
          {
            values: [
              [31536000, "{YYYY}", null, null, null, null, null, null, 1],
              [2419200, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
              [86400, "{DD}.{MM}", "\n{YYYY}", null, null, null, null, null, 1],
              [
                3600,
                "{HH}:{mm}",
                "\n{DD}.{MM} {YY}",
                null,
                "\n{DD}.{MM}",
                null,
                null,
                null,
                1
              ],
              [
                60,
                "{HH}:{mm}",
                "\n{DD}.{MM} {YY}",
                null,
                "\n{DD}.{MM}",
                null,
                null,
                null,
                1
              ],
              [
                1,
                ":{ss}",
                "\n{DD}.{MM} {YY} {HH}:{mm}",
                null,
                "\n{DD}.{MM} {HH}:{mm}",
                null,
                "\n{HHh}:{mm}",
                null,
                1
              ]
            ],
            grid: {
              show: false
            }
          },
          ...axes
        ],
        scales: scales,
        series: [
          {
            label: "Time",
            // uPlot uses epoch seconds (instead of milliseconds)
            value: (_, v) => {
              if (!v) return "–";
              return intl.formatDate(new Date(v * 1000), {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              });
            }
          },
          ...parameters.map(
            (p): uPlot.Series => ({
              ...p,
              value: (_, v) =>
                intl.formatNumberUnit(v, undefined, p.digits ?? 0)
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
  "1": { to: "%", convert: v => v * 100 },
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
