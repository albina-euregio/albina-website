import React, { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";
import { $language } from "../../appStore";

/**
 * Posted by profea-app after a successful upload.
 */
interface ProfileSavedMessage {
  source: "profea-app";
  type: "profile-saved";
  profileId: string;
}

/** Posted by profea-app in reply to our "request-close" (see its message handler). */
interface CloseResponseMessage {
  source: "profea-app";
  type: "close-response";
  ok: boolean;
}

/** A message from the profea-app iframe of the given type. */
function isProfeaMessage(
  data: unknown,
  type: string
): data is { type: string } {
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
  /** Id of the profile to edit; omitted to create a new one. */
  editId?: string;
  onSaved: (profileId: string) => void;
}

function profileFormSrc(language: string, editId?: string) {
  // The app lives at config.apis.profiles without the trailing "/api".
  const base = config.apis.profiles.replace(/\/api$/, "/");
  const params = new URLSearchParams({ embed: "1", lang: language || "en" });
  if (editId) params.set("id", editId);
  return `${base}?${params.toString()}`;
}

/** The profea-app form (create + edit) as a same-origin iframe in a modal. */
export function SnowProfileFormDialog({
  open,
  onClose,
  editId,
  onSaved
}: Props) {
  const intl = useIntl();
  const language = useStore($language);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Latest callbacks in a ref so the message listener subscribes once per
  // open, not on every parent render (onSaved/onClose are new closures each
  // render).
  const callbacksRef = useRef({ onSaved, onClose });
  callbacksRef.current = { onSaved, onClose };

  useEffect(() => {
    if (!open) return;
    const onMessage = (event: MessageEvent) => {
      // Trust only our own origin and message shape.
      if (event.origin !== window.location.origin) return;
      if (isProfileSaved(event.data)) {
        callbacksRef.current.onSaved(event.data.profileId);
      } else if (isCloseResponse(event.data) && event.data.ok) {
        // The form had no unsaved changes, or the user confirmed discarding
        // them — now it's safe to actually tear the modal down.
        callbacksRef.current.onClose();
      } else if (isProfeaMessage(event.data, "close-request")) {
        callbacksRef.current.onClose();
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
              id: editId ? "profiles:edit" : "profiles:form:title"
            })}
            src={profileFormSrc(language, editId)}
            style={{ width: "100%", height: "85vh", border: 0 }}
            allow="camera"
          />
        </div>
      )}
    </Modal>
  );
}

export default SnowProfileFormDialog;
