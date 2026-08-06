import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { $router, redirectPageQuery } from "../router";
import Modal from "../dialogs/albina-modal";
import {
  DialogFlipperButtons,
  useDialogFlipper
} from "../dialogs/dialog-flipper";
import { useIntl } from "../../i18n";
import { $language } from "../../appStore";
import type { SnowProfileData } from "../../stores/profileDataStore";

export function useSnowProfileId() {
  const router = useStore($router);
  return [
    router?.search?.profile ?? "",
    (profile: string) => redirectPageQuery({ profile })
  ] as const;
}

interface Props {
  /** Profiles to flip through, in the order the current view presents them. */
  profiles: SnowProfileData[];
  profileId: string;
  setProfileId: (id: string) => void;
}

function SnowProfileDetail({ profiles, profileId, setProfileId }: Props) {
  const intl = useIntl();
  const language = useStore($language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens the profile is wider than the dialog: pan it into view
  // first and only flip once its edge in the swiped direction is reached.
  const canSwipe = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return true;
    return direction === "left"
      ? el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
      : el.scrollLeft <= 1;
  }, []);

  const flipper = useDialogFlipper(profiles, profileId, setProfileId, {
    canSwipe
  });

  // The backend (profea-app) renders the profile to SVG for us — including the
  // localised labels, observation date and micro-region name — so the website
  // just embeds it as an image. `lang` drives that localisation; the backend
  // falls back to English for languages it doesn't yet have label tables for.
  const src =
    `${config.apis.profiles}/profiles/${encodeURIComponent(profileId)}/svg` +
    `?lang=${encodeURIComponent(language || "en")}&colorizeByGrain=true`;

  // Reset the loading/error state whenever the requested image changes, and
  // start it from the top left, not wherever its predecessor was panned to.
  useEffect(() => {
    setLoading(true);
    setError(false);
    scrollRef.current?.scrollTo({ left: 0, top: 0 });
  }, [src]);

  return (
    <div
      className="modal-container snowprofile-details"
      {...flipper.swipeHandlers}
    >
      <DialogFlipperButtons
        flipper={flipper}
        previousLabel={intl.formatMessage({ id: "profiles:detail:previous" })}
        nextLabel={intl.formatMessage({ id: "profiles:detail:next" })}
      />
      <div className="snowprofile-detail" ref={scrollRef}>
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
      {!!props.profileId && <SnowProfileDetail {...props} />}
    </Modal>
  );
}

export default SnowProfileDetailsDialog;
