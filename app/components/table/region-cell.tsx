import React, { type ReactNode } from "react";
import { FormattedMessage, type MessageId } from "../../i18n";

interface Props {
  /** Micro-region id, e.g. "AT-07-14". Rendered on top. */
  microRegion?: string;
  /** Macro-region code, e.g. "AT-07". Shown colour-coded below, if a known station region. */
  province?: string;
}

/** Region cell shared by the station, profile and incident tables; styled via `.data-table` in _data-table.scss. */
export default function RegionCell({
  microRegion,
  province
}: Props): ReactNode {
  const showProvince = !!province && config.stationRegions.includes(province);
  if (!microRegion && !showProvince) return null;
  return (
    <span className="region" title={microRegion ?? province}>
      {microRegion && (
        <FormattedMessage id={`region:${microRegion}` as MessageId} />
      )}
      {showProvince && (
        <span className={`region region-${province}`}>
          <FormattedMessage id={`region:${province}` as MessageId} />
        </span>
      )}
    </span>
  );
}
