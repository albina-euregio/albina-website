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
  /**
   * Profiles to flip through, in the order the current view presents them.
   */
  profiles: SnowProfileData[];
  profileId: string;
  setProfileId: (id: string) => void;
}

/**
 * The backend (profea-app) renders the profile to SVG for us — including the
 * localised labels, observation date and micro-region name — so the website just
 * embeds it as an image. `lang` drives that localisation; the backend falls back
 * to English for languages it doesn't yet have label tables for.
 */
function profileImageSrc(profileId: string, language: string): string {
  return (
    `${config.apis.profiles}/profiles/${encodeURIComponent(profileId)}/svg` +
    `?lang=${encodeURIComponent(language || "en")}&colorizeByGrain=true`
  );
}

/**
 * Loads `src` off-screen and only hands it over once it is ready to paint, so
 * that flipping to another profile keeps the current one on screen instead of
 * blanking the dialog. `pending` covers that hand-over, `loaded === undefined`
 * the initial load, where there is nothing to keep.
 */
function usePreloadedImage(src: string) {
  const [loaded, setLoaded] = useState<string>();
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPending(true);
    setError(false);
    const image = new Image();
    const show = () => {
      if (cancelled) return;
      setLoaded(src);
      setPending(false);
    };
    image.addEventListener("load", () => {
      // Decode before the swap, otherwise the browser may still drop a frame.
      void (image.decode?.() ?? Promise.resolve()).then(show, show);
    });
    image.addEventListener("error", () => {
      if (cancelled) return;
      setError(true);
      setPending(false);
    });
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return { loaded, pending, error };
}

function SnowProfileDetail({ profiles, profileId, setProfileId }: Props) {
  const intl = useIntl();
  const language = useStore($language);
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

  const { loaded, pending, error } = usePreloadedImage(
    profileImageSrc(profileId, language)
  );

  // Start the shown profile from the top left, not wherever its predecessor was
  // panned to.
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, top: 0 });
  }, [loaded]);

  // Warm the cache for the neighbours, so flipping on to them needs no fetch.
  useEffect(() => {
    if (pending) return;
    for (const neighbour of [flipper.previousItem, flipper.nextItem]) {
      if (!neighbour) continue;
      const image = new Image();
      image.src = profileImageSrc(neighbour.id, language);
    }
  }, [flipper.previousItem, flipper.nextItem, language, pending]);

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
      <div className="snowprofile-detail" ref={scrollRef} aria-busy={pending}>
        {error && <p>{intl.formatMessage({ id: "profiles:detail:error" })}</p>}
        {!loaded && !error && (
          <p>{intl.formatMessage({ id: "profiles:detail:loading" })}</p>
        )}
        {loaded && !error && (
          <img
            src={loaded}
            alt={intl.formatMessage({ id: "profiles:detail:loading" })}
            className={pending ? "is-stale" : undefined}
          />
        )}
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
