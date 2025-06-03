import React, { useState } from "react";
import { microRegionIds } from "../../stores/microRegions";
import { FormattedMessage } from "../../i18n";
import { Temporal } from "temporal-polyfill";

function RegionTable({ region }: { region: string }) {
  const [microRegions] = useState(() =>
    microRegionIds(Temporal.Now.plainDateISO())
  );
  const regions = microRegions.filter(id => id.startsWith(region));
  const length2 = Math.ceil(regions.length / 2);
  const regionPairs = regions
    .slice(0, length2)
    .map((r, idx) => [r, regions[idx + length2]]);

  return (
    <table className="pure-table pure-table-striped full-width">
      <thead>
        <tr>
          <th>
            <FormattedMessage id="region:table:header:code" />
          </th>
          <th>
            <FormattedMessage id="region:table:header:region" />
          </th>
          <th>
            <FormattedMessage id="region:table:header:code" />
          </th>
          <th>
            <FormattedMessage id="region:table:header:region" />
          </th>
        </tr>
      </thead>
      <tbody>
        {regionPairs.map(([r1, r2]) => (
          <tr key={r1 + r2}>
            <td>{r1}</td>
            <td>
              <FormattedMessage id={"region:" + r1} />
            </td>
            <td>{r2}</td>
            <td>{r2 && <FormattedMessage id={"region:" + r2} />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RegionTable;

export function RegionsTables() {
  return (
    <>
      {config.regionCodes.map(region => (
        <div key={region}>
          <h3 style={{ textAlign: "center" }}>
            <FormattedMessage id={"region:" + region} />
          </h3>
          <div className="table-container">
            <RegionTable region={region}></RegionTable>
          </div>
        </div>
      ))}
    </>
  );
}
