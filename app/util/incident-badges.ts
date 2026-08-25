import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import type { IncidentData } from "../stores/incidentDataStore";

export interface IncidentBadgeData {
  key: string;
  text: string;
}

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

export function incidentBadges(
  incident: IncidentData,
  messages: IncidentReportMessages
): IncidentBadgeData[] {
  const badges: IncidentBadgeData[] = [];
  for (const field of AVALANCHE_BADGE_FIELDS) {
    const text = avalancheBadgeText(incident, messages, field);
    if (text) badges.push({ key: field, text });
  }
  return badges;
}
