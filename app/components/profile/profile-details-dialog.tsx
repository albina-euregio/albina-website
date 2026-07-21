import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $router, redirectPageQuery } from "../router";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";
import { $language } from "../../appStore";

export function useSnowProfileId() {
  const router = useStore($router);
  return [
    router?.search?.profile ?? "",
    (profile: string) => redirectPageQuery({ profile })
  ] as const;
}

interface Props {
  profileId: string;
  setProfileId: (id: string) => void;
}

function SnowProfileDetail({ profileId }: { profileId: string }) {
  const intl = useIntl();
  const language = useStore($language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // The backend (profea-app) renders the profile to SVG for us — including the
  // localised labels, observation date and micro-region name — so the website
  // just embeds it as an image. `lang` drives that localisation; the backend
  // falls back to English for languages it doesn't yet have label tables for.
  const src =
    `${config.apis.profiles}/profiles/${encodeURIComponent(profileId)}/svg` +
    `?lang=${encodeURIComponent(language || "en")}&colorizeByGrain=true`;

  // Reset the loading/error state whenever the requested image changes.
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className="snowprofile-detail">
      {loading && !error && (
        <p>{intl.formatMessage({ id: "profiles:detail:loading" })}</p>
      )}
      {error && <p>{intl.formatMessage({ id: "profiles:detail:error" })}</p>}
      <img
        src={src}
        alt={intl.formatMessage({ id: "profiles:detail:loading" })}
        style={{ display: loading || error ? "none" : undefined }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}

export function SnowProfileDetailsDialog(props: Props) {
  return (
    <Modal
      isOpen={!!props.profileId}
      onClose={() => props.setProfileId("")}
      width="fit-content"
    >
      {!!props.profileId && <SnowProfileDetail profileId={props.profileId} />}
    </Modal>
  );
}

export default SnowProfileDetailsDialog;
