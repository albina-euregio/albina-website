import type { MessageId, useIntl } from "../i18n";
import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import type {
  IncidentData,
  IncidentInvolvement
} from "../stores/incidentDataStore";

/**
 * Involvement categories are labelled from the shared incident-report resource.
 */
const INVOLVEMENT_LABELS: Record<
  IncidentInvolvement,
  [category: string, value: string]
> = {
  fatal: ["incidentReport", "fatalities"],
  injured: ["incidentReport", "injuredSurvivors"],
  involved: ["personInvolvement", "Yes"],
  uninvolved: ["personInvolvement", "No"],
  unknown: ["personInvolvement", "Unknown"]
};

export function involvementLabel(
  messages: IncidentReportMessages,
  involvement: IncidentInvolvement
): string {
  const [category, value] = INVOLVEMENT_LABELS[involvement];
  return translateIncidentValue(messages, category, value) ?? value;
}

/**
 * An incident's involvement as one short phrase — "Incident with fatalities
 * (2)", "Incident without involvement", … Shared by the dashboard map's
 * marker tooltip and the incident table.
 */
export function involvementText(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>
): string {
  const { involvement, fatalities, injuredSurvivors } = incident;
  const count = (id: MessageId, value: number): string =>
    intl.formatMessage({ id }, { count: intl.formatNumber(value) });
  switch (involvement) {
    case "fatal":
      return count("incidents:involvement:fatal", fatalities);
    case "injured":
      return count("incidents:involvement:injured", injuredSurvivors);
    case "involved":
      return intl.formatMessage({ id: "incidents:involvement:involved" });
    case "uninvolved":
      return intl.formatMessage({ id: "incidents:involvement:uninvolved" });
    case "unknown":
      return intl.formatMessage({ id: "incidents:involvement:unknown" });
  }
}
