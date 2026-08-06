import type { useIntl, MessageId } from "../i18n";
import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import { getWarnlevelNumber } from "./warn-levels";
import type { IncidentData } from "../stores/incidentDataStore";

export interface IncidentBadgeData {
  key: string;
  text: string;
}

const AVALANCHE_BADGE_FIELDS = ["avalancheType", "avalancheSize"] as const;

/**
 * The danger rating as a compact badge text, e.g. "danger level 3". Falls
 * back to the plain rating name for ratings without a level number
 * (`no_snow`, `no_rating`).
 */
export function dangerRatingBadgeText(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>
): string | undefined {
  const dangerRating = incident.dangerRating;
  if (!dangerRating) return undefined;
  const warnlevelNumber = getWarnlevelNumber(dangerRating);
  return warnlevelNumber
    ? intl.formatMessage(
        { id: "incidents:danger-level" },
        { number: String(warnlevelNumber) }
      )
    : intl.formatMessage({ id: `danger-level:${dangerRating}` as MessageId });
}

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
  intl: ReturnType<typeof useIntl>,
  messages: IncidentReportMessages
): IncidentBadgeData[] {
  const badges: IncidentBadgeData[] = [];
  const dangerText = dangerRatingBadgeText(incident, intl);
  if (dangerText) badges.push({ key: "dangerRating", text: dangerText });
  for (const field of AVALANCHE_BADGE_FIELDS) {
    const text = avalancheBadgeText(incident, messages, field);
    if (text) badges.push({ key: field, text });
  }
  return badges;
}
