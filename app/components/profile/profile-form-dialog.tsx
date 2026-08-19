import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";
import { $language } from "../../appStore";

/** Posted by profea-app after a successful upload (see its runUpload). */
interface ProfileSavedMessage {
  source: "profea-app";
  type: "profile-saved";
  profileId: string;
  editToken: string;
}

function isProfileSaved(data: unknown): data is ProfileSavedMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { source?: unknown }).source === "profea-app" &&
    (data as { type?: unknown }).type === "profile-saved" &&
    typeof (data as { profileId?: unknown }).profileId === "string"
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** When set, edit that profile instead of creating a new one. */
  edit?: { id: string; token: string };
  onSaved: (profileId: string, editToken: string) => void;
}

function profileFormSrc(
  language: string,
  edit?: { id: string; token: string }
) {
  // The app lives at config.apis.profiles without the trailing "/api".
  const base = config.apis.profiles.replace(/\/api$/, "/");
  const params = new URLSearchParams({ embed: "1", lang: language || "en" });
  if (edit) {
    params.set("id", edit.id);
    params.set("token", edit.token);
  }
  return `${base}?${params.toString()}`;
}

/** The profea-app form (create + edit) as a same-origin iframe in a modal. */
export function SnowProfileFormDialog({ open, onClose, edit, onSaved }: Props) {
  const intl = useIntl();
  const language = useStore($language);

  useEffect(() => {
    if (!open) return;
    const onMessage = (event: MessageEvent) => {
      // Trust only our own origin and message shape.
      if (event.origin !== window.location.origin) return;
      if (!isProfileSaved(event.data)) return;
      onSaved(event.data.profileId, event.data.editToken);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, onSaved]);

  return (
    <Modal isOpen={open} onClose={onClose} width="90vw">
      {open && (
        <div className="modal-container snowprofile-form">
          <iframe
            className="snowprofile-form__frame"
            title={intl.formatMessage({
              id: edit ? "profiles:edit" : "profiles:form:title"
            })}
            src={profileFormSrc(language, edit)}
            style={{ width: "100%", height: "85vh", border: 0 }}
            allow="camera"
          />
        </div>
      )}
    </Modal>
  );
}

export default SnowProfileFormDialog;
