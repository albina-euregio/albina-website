import React, { useEffect, useState } from "react";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";

interface Props {
  /** The profile the user wants to edit; empty string keeps the dialog closed. */
  profileId: string;
  onClose: () => void;
  /** Called with the token the user entered, to open the edit form. */
  onSubmit: (token: string) => void;
}

/**
 * Asks for a profile's edit token when this session doesn't already hold one
 * (e.g. the user is on a different device than where they created it). On
 * submit we hand the token to the edit form, which verifies it on save.
 */
function SnowProfileTokenDialog({ profileId, onClose, onSubmit }: Props) {
  const intl = useIntl();
  const [token, setToken] = useState("");

  // Clear the field whenever the dialog closes so the next open starts blank.
  useEffect(() => {
    if (!profileId) setToken("");
  }, [profileId]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = token.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <Modal isOpen={!!profileId} onClose={onClose} width="min(90vw, 26rem)">
      <div className="modal-container snowprofile-token">
        <h2>{intl.formatMessage({ id: "profiles:token:title" })}</h2>
        <p className="snowprofile-token__intro">
          {intl.formatMessage({ id: "profiles:token:intro" })}
        </p>
        <form className="pure-form" onSubmit={submit}>
          <label
            className="snowprofile-token__label"
            htmlFor="profile-edit-token"
          >
            {intl.formatMessage({ id: "profiles:token:label" })}
          </label>
          <input
            id="profile-edit-token"
            className="snowprofile-token__input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={token}
            onChange={event => setToken(event.target.value)}
          />
          <div className="snowprofile-token__actions">
            {/* Escape hatch for a lost token. Disabled until the resend
                endpoint exists — a live-looking button that does nothing on
                click would be worse than a clearly unavailable one.
                TODO: enable + wire up once the backend supports it. */}
            {/* <button
              type="button"
              className="pure-button secondary"
              disabled
              title={intl.formatMessage({ id: "profiles:token:resend-unavailable" })}
            >
              {intl.formatMessage({ id: "profiles:token:resend" })}
            </button> */}
            <button
              type="submit"
              className="pure-button"
              disabled={!token.trim()}
            >
              {intl.formatMessage({ id: "profiles:token:submit" })}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SnowProfileTokenDialog;
