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

/** Width of the exported PNG: A4 at 300 dpi, matching the PDF. */
const PNG_WIDTH = 2480;

/**
 * Rasterises the served SVG. Loading it from a blob URL keeps the canvas
 * untainted; the explicit size replaces profea's inline on-screen sizing.
 */
async function svgToPng(svgMarkup: string): Promise<Blob> {
  const svg = new DOMParser().parseFromString(
    svgMarkup,
    "image/svg+xml"
  ).documentElement;
  const [, , vbWidth, vbHeight] = (svg.getAttribute("viewBox") ?? "")
    .split(/[\s,]+/)
    .map(Number);
  const width = PNG_WIDTH;
  const height = Math.round(
    vbWidth && vbHeight
      ? (PNG_WIDTH * vbHeight) / vbWidth
      : PNG_WIDTH * Math.SQRT2
  );
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.removeAttribute("style");

  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml"
    })
  );
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error("PNG export failed"))),
        "image/png"
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
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

  const fileBaseName = useCallback(() => {
    const profile = profiles.find(p => p.id === profileId);
    const place = (profile?.location || "profile").replace(
      /[^a-zA-Z0-9]+/g,
      "_"
    );
    const date = profile?.dateTime?.toISOString().slice(0, 10) ?? profileId;
    return `${place}_${date}_snowprofile`;
  }, [profileId, profiles]);

  const handlePrint = useCallback(async () => {
    const response = await fetch(imageSrc);
    const svgMarkup = await response.text();
    const win = window.open("", "_blank");
    if (!win) return;
    const doc = win.document;
    doc.title = fileBaseName();
    const style = doc.createElement("style");
    // The served SVG carries an inline `max-height:calc(100vh - 70px)` (profea's
    // on-screen default); without max-height:none it caps the print height below
    // A4 and the page never fills. @page + zeroed body remove the sheet margins.
    style.textContent =
      `@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0}` +
      `svg{width:210mm!important;height:297mm!important;` +
      `max-width:none!important;max-height:none!important;display:block!important}`;
    doc.head.appendChild(style);
    doc.body.innerHTML = svgMarkup;
    win.onafterprint = () => win.close();
    setTimeout(() => win.print(), 300);
  }, [imageSrc, fileBaseName]);

  const handleSavePng = useCallback(async () => {
    const response = await fetch(imageSrc);
    const blob = await svgToPng(await response.text());
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBaseName()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  }, [imageSrc, fileBaseName]);

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
        <button
          type="button"
          className="snowprofile-detail__action"
          onClick={handlePrint}
          title={intl.formatMessage({ id: "profiles:detail:print-pdf" })}
          aria-label={intl.formatMessage({ id: "profiles:detail:print-pdf" })}
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
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        </button>
        <button
          type="button"
          className="snowprofile-detail__action"
          onClick={handleSavePng}
          title={intl.formatMessage({ id: "profiles:detail:save-png" })}
          aria-label={intl.formatMessage({ id: "profiles:detail:save-png" })}
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
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
          </svg>
        </button>
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
