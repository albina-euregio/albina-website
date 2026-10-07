import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { useIntl, type MessageId } from "../../i18n";

export interface ExportAction {
  /** File format lettered on the icon, e.g. CSV. */
  format: string;
  labelId: MessageId;
  descId: MessageId;
  run: () => void;
}

interface Props {
  id?: string;
  actions: readonly ExportAction[];
  disabled?: boolean;
  /** Shown below the formats. */
  note?: ReactNode;
}

/** A document icon with the file format lettered on it (e.g. CSV, XML). */
function FileBadgeIcon({ label }: { label: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <text
        x="12"
        y="18"
        fontSize={label.length > 3 ? "5" : "6.5"}
        fontWeight="700"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >
        {label}
      </text>
    </svg>
  );
}

/** "Export ▾" button of the dashboard filter bar, listing download formats. */
export default function ExportMenu({ id, actions, disabled, note }: Props) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div id={id} className="station-dashboard-filter__export" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(open => !open)}
        disabled={disabled}
        className="pure-button station-dashboard-filter__export-button"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 2v9" />
          <path d="M5 8l4 4 4-4" />
          <path d="M3 15h12" />
        </svg>
        {intl.formatMessage({ id: "profiles:export" })}
        <span
          className="station-dashboard-filter__export-caret"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="station-dashboard-filter__export-menu" role="menu">
          {actions.map(action => (
            <button
              key={action.format}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                action.run();
              }}
            >
              <FileBadgeIcon label={action.format} />
              <span className="station-dashboard-filter__export-menu-text">
                <span className="station-dashboard-filter__export-menu-title">
                  {intl.formatMessage({ id: action.labelId })}
                </span>
                <span className="station-dashboard-filter__export-menu-desc">
                  {intl.formatMessage({ id: action.descId })}
                </span>
              </span>
            </button>
          ))}
          {note && (
            <p className="station-dashboard-filter__export-note">{note}</p>
          )}
        </div>
      )}
    </div>
  );
}
