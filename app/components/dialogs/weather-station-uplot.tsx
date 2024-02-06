import React, { useEffect, useState } from "react";
import type uPlot from "uplot";
import UplotReact from "uplot-react";
import { useIntl } from "../../i18n";
import { Util } from "leaflet";
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
  const url = Util.template(window.config.apis.weather.stationsArchiveFile, {
    "LWD-Nummer": stationData.properties["LWD-Nummer"] || stationData.id,
    parameter,
    file: "latest"
  });

  useEffect(() => {
    fetch("https://corsproxy.io/?" + encodeURIComponent(url))
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => new TextDecoder("iso-8859-1").decode(arrayBuffer))
      .then(csv => parseData(csv, timeRangeMilli, setUnit))
      .then(data => setData(data));
  }, [timeRangeMilli, url]);

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
  timeRangeMilli: number,
  setUnit: (unit: string) => void
): uPlot.AlignedData {
  let timezone = "+01:00";
  const timestamps: number[] = [];
  const values: number[] = [];
  csv.split(/\r?\n/).forEach(line => {
    if (line.startsWith("Zeitzone;")) {
      timezone = line.slice("Zeitzone;".length);
      return;
    } else if (line.startsWith("Einheit der Zeitreihe;")) {
      setUnit(line.slice("Einheit der Zeitreihe;".length));
    }

    // 02.12.2023 06:10:00;-6,8
    const regex =
      /(?<day>\d{2})\.(?<month>\d{2})\.(?<year>\d{4}) (?<time>\d{2}:\d{2}:\d{2});(?<value>[-+0-9,.]+)/;
    const match = regex.exec(line);
    if (!match) return;
    const { day, month, year, time, value } = match.groups;
    const date = Date.parse(`${year}-${month}-${day}T${time}${timezone}`);
    if (Date.now() - date > timeRangeMilli) return;
    // uPlot uses epoch seconds (instead of milliseconds)
    timestamps.push(date / 1000);
    values.push(+value.replace(",", "."));
  });
  return [timestamps, values];
}
