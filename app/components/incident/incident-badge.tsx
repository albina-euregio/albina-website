import React, { type ReactNode } from "react";
import type { IncidentBadgeData } from "../../util/incident-badges";

/** A single pill badge — danger level or avalanche type/size. */
export function IncidentBadge({ children }: { children: ReactNode }) {
  return <span className="incident-badge">{children}</span>;
}

/** The badge cluster shown in the details dialog header and map tooltip. */
export function IncidentBadges({ badges }: { badges: IncidentBadgeData[] }) {
  if (!badges.length) return null;
  return (
    <div className="incident-badges">
      {badges.map(badge => (
        <IncidentBadge key={badge.key}>{badge.text}</IncidentBadge>
      ))}
    </div>
  );
}
