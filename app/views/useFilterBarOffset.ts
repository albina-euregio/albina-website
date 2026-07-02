import { type CSSProperties, useEffect, useRef, useState } from "react";

/**
 * Measures the dashboard filter bar so the fixed map/table toggle button and
 * the map controls can be positioned below it. Shared by the station and
 * incident dashboards.
 */
export function useFilterBarOffset() {
  const [filterHeight, setFilterHeight] = useState(0);
  const [filterTop, setFilterTop] = useState(0);
  const filterRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const filterElement = filterRef.current;
    if (!filterElement || typeof ResizeObserver === "undefined") return;

    const updateFilterHeight = () => {
      const rect = filterElement.getBoundingClientRect();
      setFilterHeight(rect.height);
      // Measure actual position at scroll=0 so sticky threshold matches exactly
      if (document.documentElement.scrollTop === 0) {
        setFilterTop(rect.top);
      }
    };

    updateFilterHeight();

    const observer = new ResizeObserver(() => {
      updateFilterHeight();
    });

    observer.observe(filterElement);
    return () => {
      observer.disconnect();
    };
  }, []);

  const offsetStyle = {
    "--station-dashboard-filter-offset": `${filterHeight}px`,
    "--station-dashboard-filter-top": `${filterTop}px`
  } as CSSProperties;

  const topStyle = {
    "--station-dashboard-filter-top": `${filterTop}px`
  } as CSSProperties;

  return { filterRef, offsetStyle, topStyle };
}
