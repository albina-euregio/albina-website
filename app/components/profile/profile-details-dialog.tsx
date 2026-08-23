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
  onEdit?: (id: string) => void;
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

/** CAAML XML representation of the profile, for download. */
function profileXmlSrc(profileId: string): string {
  return `${config.apis.profiles}/profiles/${encodeURIComponent(profileId)}?format=xml`;
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

function SnowProfileDetail({
  profiles,
  profileId,
  setProfileId,
  onEdit
}: Props) {
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

  const imageSrc = profileImageSrc(profileId, language);
  const { loaded, pending, error } = usePreloadedImage(imageSrc);

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
        previousLabel={intl.formatMessage({ id: "dialog:flipper:previous" })}
        nextLabel={intl.formatMessage({ id: "dialog:flipper:next" })}
      />
      <div className="snowprofile-detail__actions">
        {onEdit && (
          <button
            type="button"
            className="snowprofile-detail__action"
            onClick={() => onEdit(profileId)}
            title={intl.formatMessage({ id: "profiles:edit" })}
            aria-label={intl.formatMessage({ id: "profiles:edit" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
        )}
        <a
          className="snowprofile-detail__action"
          href={profileXmlSrc(profileId)}
          download={`${profileId}.xml`}
          title={intl.formatMessage({ id: "profiles:detail:download-xml" })}
          aria-label={intl.formatMessage({
            id: "profiles:detail:download-xml"
          })}
        >
          <span className="icon-download" aria-hidden="true" />
        </a>
        <a
          className="snowprofile-detail__action"
          href={imageSrc}
          target="_blank"
          rel="noopener noreferrer"
          title={intl.formatMessage({ id: "profiles:detail:open-tab" })}
          aria-label={intl.formatMessage({ id: "profiles:detail:open-tab" })}
        >
          <span className="icon-external" aria-hidden="true" />
        </a>
      </div>
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
