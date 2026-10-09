import React from "react";
import { useIntl } from "../../i18n";

interface Props {
  expanded: boolean;
  onToggle: () => void;
  /** Space-separated ids of the elements it shows/hides. */
  controls: string;
}

/** Chevron that expands the collapsed filters of the dashboard filter bar on small screens. */
export default function FilterBarToggle({
  expanded,
  onToggle,
  controls
}: Props) {
  const intl = useIntl();
  return (
    <button
      className="station-dashboard-filter__toggle"
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={intl.formatMessage({ id: "filter:toggle" })}
      onClick={onToggle}
    >
      <span
        className="station-dashboard-filter__toggle-chevron"
        aria-hidden="true"
      />
    </button>
  );
}
