import React, { type ReactNode } from "react";
import type {
  IncidentBadgeData,
  IncidentBadgeVariant
} from "../../util/incident-badges";

/** Also used by the map tooltip, which builds its badges as an HTML string. */
export function incidentBadgeClassName(variant?: IncidentBadgeVariant): string {
  return variant
    ? `incident-badge incident-badge--${variant}`
    : "incident-badge";
}

/** A single pill badge — neutral by default, or the blue "analysis" variant. */
export function IncidentBadge({
  children,
  variant,
  onClick
}: {
  children: ReactNode;
  variant?: IncidentBadgeVariant;
  onClick?: () => void;
}) {
  const className = incidentBadgeClassName(variant);
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
}

/** The badge cluster shown in the details dialog header and map tooltip. */
export function IncidentBadges({ badges }: { badges: IncidentBadgeData[] }) {
  if (!badges.length) return null;
  return (
    <div className="incident-badges">
      {badges.map(badge => (
        <IncidentBadge
          key={badge.key}
          variant={badge.variant}
          onClick={badge.onClick}
        >
          {badge.text}
        </IncidentBadge>
      ))}
    </div>
  );
}
