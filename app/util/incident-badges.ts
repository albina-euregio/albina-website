import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import type { IncidentData } from "../stores/incidentDataStore";

export type IncidentBadgeVariant = "info";

export interface IncidentBadgeData {
  key: string;
  text: string;
  variant?: IncidentBadgeVariant;
  /** Ignored by the map tooltip, which renders its badges as an HTML string. */
  onClick?: () => void;
}

export const ANALYSIS_BADGE_KEY = "incidentAnalysis";

const AVALANCHE_BADGE_FIELDS = ["avalancheType", "avalancheSize"] as const;

export function avalancheBadgeText(
  incident: IncidentData,
  messages: IncidentReportMessages,
  field: (typeof AVALANCHE_BADGE_FIELDS)[number]
): string | undefined {
  const value = incident[field];
  if (!value || value === "unknown") return undefined;
  return translateIncidentValue(messages, field, value);
}

/** The blue analysis badge leads the cluster, ahead of the neutral ones. */
export function incidentBadges(
  incident: IncidentData,
  messages: IncidentReportMessages,
  analysisLabel: string
): IncidentBadgeData[] {
  const badges: IncidentBadgeData[] = [];
  if (incident.hasAnalysis) {
    badges.push({
      key: ANALYSIS_BADGE_KEY,
      text: analysisLabel,
      variant: "info"
    });
  }
  for (const field of AVALANCHE_BADGE_FIELDS) {
    const text = avalancheBadgeText(incident, messages, field);
    if (text) badges.push({ key: field, text });
  }
  return badges;
}
