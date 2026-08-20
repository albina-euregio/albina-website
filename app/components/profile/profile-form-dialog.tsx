import React, { useEffect, useRef } from "react";
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

/** Posted by profea-app in reply to our "request-close" (see its message handler). */
interface CloseResponseMessage {
  source: "profea-app";
  type: "close-response";
  ok: boolean;
}

/** A message from the profea-app iframe of the given type. */
function isProfeaMessage(data: unknown, type: string): data is { type: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { source?: unknown }).source === "profea-app" &&
    (data as { type?: unknown }).type === type
  );
}

function isProfileSaved(data: unknown): data is ProfileSavedMessage {
  return (
    isProfeaMessage(data, "profile-saved") &&
    typeof (data as { profileId?: unknown }).profileId === "string"
  );
}

function isCloseResponse(data: unknown): data is CloseResponseMessage {
  return isProfeaMessage(data, "close-response");
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
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Latest callbacks in refs so the message listener subscribes once per open,
  // not on every parent render (onSaved/onClose are new closures each render).
  const onSavedRef = useRef(onSaved);
  const onCloseRef = useRef(onClose);
  onSavedRef.current = onSaved;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onMessage = (event: MessageEvent) => {
      // Trust only our own origin and message shape.
      if (event.origin !== window.location.origin) return;
      if (isProfileSaved(event.data)) {
        onSavedRef.current(event.data.profileId, event.data.editToken);
      } else if (isCloseResponse(event.data) && event.data.ok) {
        // The form had no unsaved changes, or the user confirmed discarding
        // them — now it's safe to actually tear the modal down.
        onCloseRef.current();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open]);

  // A close gesture doesn't close the modal directly: ask the embedded app
  // first (it owns the unsaved-changes check and confirmation, matching the
  // standalone app). It replies with a close-response we handle above.
  const requestClose = () => {
    const frame = frameRef.current?.contentWindow;
    if (!frame) {
      onClose();
      return;
    }
    frame.postMessage(
      { source: "albina", type: "request-close" },
      window.location.origin
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={requestClose}
      guardClose
      width="min(1600px, 95vw)"
    >
      {open && (
        <div className="modal-container snowprofile-form">
          <iframe
            ref={frameRef}
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
