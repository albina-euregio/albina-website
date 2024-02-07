import React, { useEffect, useState } from "react";
import type uPlot from "uplot";
import UplotReact from "uplot-react";
import { useIntl } from "../../i18n";
import type { StationData } from "../../stores/stationDataStore";
import "uplot/dist/uPlot.min.css";

const WeatherStationUplot: React.FC<{
  stationData: StationData;
  parameter: string;
  parameterLabel: string;
  stroke: string;
  timeRangeMilli: number;
  height: number;
  width: number;
}> = ({
  stationData,
  parameter,
  parameterLabel,
  stroke,
  timeRangeMilli,
  height,
  width
}) => {
  const intl = useIntl();
  const [data, setData] = useState<uPlot.AlignedData>([[], []]);
  const [unit, setUnit] = useState("");
  const id = stationData.properties["LWD-Nummer"];
  const url = `https://api.avalanche.report/lawine/grafiken/smet/woche/${id}.smet.gz`;

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(csv => parseData(csv, parameter, timeRangeMilli, setUnit))
      .then(data => setData(data));
  }, [parameter, timeRangeMilli, url]);

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
            label: parameterLabel,
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
          {
            label: parameterLabel,
            value: (_, v) =>
              intl.formatNumber(v, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              }) +
              " " +
              unit,
            stroke
          }
        ]
      }}
    />
  );
};

export default WeatherStationUplot;

function parseData(
  csv: string,
  parameter: string,
  timeRangeMilli: number,
  setUnit: (unit: string) => void
): uPlot.AlignedData {
  let index = -1;
  const timestamps: number[] = [];
  const values: number[] = [];
  csv.split(/\r?\n/).forEach(line => {
    if (line.startsWith("fields =")) {
      const fields = line.slice("fields =".length).trim().split(" ");
      index = fields.indexOf(parameter);
      return;
    } else if (line.startsWith("#units =") && index >= 0) {
      const units = line.slice("#units =".length).trim().split(" ");
      setUnit(units[index]);
      return;
    } else if (!/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.test(line)) {
      return;
    } else if (index < 0) {
      return;
    }
    const cells = line.split(" ");
    const date = Date.parse(cells[0]);
    if (Date.now() - date > timeRangeMilli) return;
    // uPlot uses epoch seconds (instead of milliseconds)
    timestamps.push(date / 1000);
    const value = cells[index];
    values.push(+value.replace(",", "."));
  });
  return [timestamps, values];
}
