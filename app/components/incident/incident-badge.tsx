import React, { type ReactNode } from "react";
import type { IncidentBadgeData } from "../../util/incident-badges";

/** A single pill badge — neutral by default, or the blue "analysis" variant. */
export function IncidentBadge({
  children,
  variant,
  onClick
}: {
  children: ReactNode;
  variant?: "info";
  onClick?: () => void;
}) {
  const className = ["incident-badge", variant && `incident-badge--${variant}`]
    .filter(Boolean)
    .join(" ");
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
export function IncidentBadges({
  badges,
  children
}: {
  badges: IncidentBadgeData[];
  children?: ReactNode;
}) {
  if (!badges.length && !children) return null;
  return (
    <div className="incident-badges">
      {badges.map(badge => (
        <IncidentBadge key={badge.key}>{badge.text}</IncidentBadge>
      ))}
      {children}
    </div>
  );
}
