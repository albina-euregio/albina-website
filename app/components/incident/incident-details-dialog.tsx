import React from "react";
import Modal from "../dialogs/albina-modal";
import type { IncidentData } from "../../stores/incidentDataStore";

interface Props {
  incident: IncidentData | undefined;
  onClose: () => void;
}

export function IncidentDetailsDialog({ incident, onClose }: Props) {
  return (
    <Modal isOpen={!!incident} onClose={onClose} width="90vw">
      {incident && <pre>{JSON.stringify(incident, null, 2)}</pre>}
    </Modal>
  );
}

export default IncidentDetailsDialog;
