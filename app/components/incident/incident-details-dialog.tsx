import React, { type ReactNode } from "react";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";
import {
  useIncidentReportMessages,
  translateIncidentValue
} from "../../i18n/incident-report";
import { DATE_TIME_FORMAT } from "../../util/date";
import type { IncidentData } from "../../stores/incidentDataStore";

interface Props {
  incident: IncidentData | undefined;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <tr>
      <th>{label}</th>
      <td>{value}</td>
    </tr>
  );
}

function IncidentDetails({ incident }: { incident: IncidentData }) {
  const intl = useIntl();
  const t = useIncidentReportMessages();
  const label = (key: string) => t.incidentReport?.[key] ?? key;

  const { publicData } = incident;
  const dangerRating = incident.dangerRating;

  return (
    <table className="pure-table pure-table-striped pure-table-small">
      <tbody>
        <Row
          label={label("dateTime")}
          value={
            incident.dateTime &&
            intl.formatDate(incident.dateTime, DATE_TIME_FORMAT)
          }
        />
        <Row label={label("location")} value={incident.location} />
        <Row
          label={label("avalancheRegion")}
          value={publicData.avalancheRegion}
        />
        <Row
          label={label("startZoneElevation")}
          value={
            typeof publicData.startZoneElevation === "number" &&
            intl.formatNumberUnit(publicData.startZoneElevation, "m")
          }
        />
        <Row
          label={label("dangerRating")}
          value={
            dangerRating &&
            intl.formatMessage({ id: `danger-level:${dangerRating}` })
          }
        />
        <Row label={label("avalancheType")} value={incident.avalancheType} />
        <Row label={label("avalancheSize")} value={incident.avalancheSize} />
        <Row
          label={label("trigger")}
          value={translateIncidentValue(t, "trigger", publicData.trigger)}
        />
        <Row
          label={label("remoteTriggering")}
          value={translateIncidentValue(
            t,
            "remoteTriggering",
            publicData.remoteTriggering
          )}
        />
        <Row
          label={label("personInvolvement")}
          value={incident.personInvolvement}
        />
        <Row
          label={label("otherDamages")}
          value={translateIncidentValue(
            t,
            "otherDamages",
            publicData.otherDamages
          )}
        />
      </tbody>
    </table>
  );
}

export function IncidentDetailsDialog({ incident, onClose }: Props) {
  return (
    <Modal isOpen={!!incident} onClose={onClose} width="90vw">
      {incident && <IncidentDetails incident={incident} />}
    </Modal>
  );
}

export default IncidentDetailsDialog;
