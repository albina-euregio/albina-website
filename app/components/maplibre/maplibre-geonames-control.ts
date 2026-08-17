import type maplibregl from "maplibre-gl";

/** Configuration for {@link GeonamesControl}, mirroring `config.map.geonames`. */
export interface GeonamesOptions {
  geonamesURL: string;
  username: string;
  maxresults: number;
  bbox: { east: number; west: number; north: number; south: number };
  featureClasses: string[];
  baseQuery?: string;
  /** Two-letter UI language for localized place names. */
  lang: string;
  /** Tooltip/aria-label for the toggle button. */
  title: string;
  /** Placeholder for the search input. */
  placeholder: string;
  /** Shown when a search returns no results. */
  noResults: string;
}

interface GeonameResult {
  name: string;
  lat: string;
  lng: string;
  adminName1?: string;
  countryName?: string;
  bbox?: { east: number; west: number; north: number; south: number };
}

/**
 * A MapLibre GL geocoder control backed by the GeoNames `searchJSON` API.
 * Replaces the Leaflet `L.Control.Geonames` lost in the MapLibre migration:
 * a magnifier button expands a search box, results fly/fit the map to the pick.
 */
export class GeonamesControl implements maplibregl.IControl {
  private _map?: maplibregl.Map;
  private _container!: HTMLDivElement;
  private _input!: HTMLInputElement;
  private _results!: HTMLUListElement;
  private _debounce?: ReturnType<typeof setTimeout>;
  private _onDocPointerDown?: (ev: MouseEvent) => void;
  private readonly _opts: GeonamesOptions;

  constructor(opts: GeonamesOptions) {
    this._opts = opts;
  }

  getDefaultPosition(): maplibregl.ControlPosition {
    return "top-left";
  }

  onAdd(map: maplibregl.Map): HTMLElement {
    this._map = map;

    const container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group geonames-ctrl";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "geonames-ctrl-toggle";
    toggle.title = this._opts.title;
    toggle.setAttribute("aria-label", this._opts.title);
    toggle.innerHTML =
      '<span class="geonames-ctrl-icon" aria-hidden="true"></span>';

    const form = document.createElement("form");
    form.className = "geonames-ctrl-form";
    form.addEventListener("submit", e => e.preventDefault());

    const input = document.createElement("input");
    input.type = "text";
    input.className = "geonames-ctrl-input";
    input.placeholder = this._opts.placeholder;
    input.setAttribute("aria-label", this._opts.placeholder);

    const results = document.createElement("ul");
    results.className = "geonames-ctrl-results";

    form.append(input, results);
    container.append(toggle, form);

    toggle.addEventListener("click", () => this._toggle());
    input.addEventListener("input", () => this._onInput());

    this._onDocPointerDown = (ev: MouseEvent) => {
      if (!container.contains(ev.target as Node)) this._close();
    };
    document.addEventListener("mousedown", this._onDocPointerDown);

    this._container = container;
    this._input = input;
    this._results = results;
    return container;
  }

  onRemove(): void {
    clearTimeout(this._debounce);
    if (this._onDocPointerDown) {
      document.removeEventListener("mousedown", this._onDocPointerDown);
    }
    this._container.remove();
    this._map = undefined;
  }

  private _toggle(): void {
    if (this._container.classList.contains("is-open")) {
      this._close();
    } else {
      this._container.classList.add("is-open");
      this._input.focus();
    }
  }

  private _close(): void {
    this._container.classList.remove("is-open");
    this._results.replaceChildren();
  }

  private _onInput(): void {
    const query = this._input.value.trim();
    clearTimeout(this._debounce);
    if (query.length < 2) {
      this._results.replaceChildren();
      return;
    }
    this._debounce = setTimeout(() => void this._search(query), 300);
  }

  private async _search(query: string): Promise<void> {
    const o = this._opts;
    const params = new URLSearchParams({
      q: query,
      maxRows: String(o.maxresults),
      username: o.username,
      lang: o.lang,
      style: "MEDIUM",
      east: String(o.bbox.east),
      west: String(o.bbox.west),
      north: String(o.bbox.north),
      south: String(o.bbox.south)
    });
    for (const fc of o.featureClasses) params.append("featureClass", fc);

    const origin = o.geonamesURL.startsWith("//")
      ? `https:${o.geonamesURL}`
      : o.geonamesURL;
    const url = `${origin}?${params}${o.baseQuery ? `&${o.baseQuery}` : ""}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as { geonames?: GeonameResult[] };
      this._render(data.geonames ?? []);
    } catch {
      this._render([]);
    }
  }

  private _render(items: GeonameResult[]): void {
    this._results.replaceChildren();
    if (!items.length) {
      const li = document.createElement("li");
      li.className = "geonames-ctrl-empty";
      li.textContent = this._opts.noResults;
      this._results.append(li);
      return;
    }
    for (const item of items) {
      const li = document.createElement("li");
      li.className = "geonames-ctrl-result";
      li.textContent = [item.name, item.adminName1, item.countryName]
        .filter(Boolean)
        .join(", ");
      li.addEventListener("click", () => this._pick(item));
      this._results.append(li);
    }
  }

  private _pick(item: GeonameResult): void {
    const map = this._map;
    if (!map) return;
    if (item.bbox) {
      map.fitBounds(
        [
          [item.bbox.west, item.bbox.south],
          [item.bbox.east, item.bbox.north]
        ],
        { padding: 40, maxZoom: map.getMaxZoom() }
      );
    } else {
      map.flyTo({
        center: [parseFloat(item.lng), parseFloat(item.lat)],
        zoom: Math.min(9, map.getMaxZoom())
      });
    }
    this._input.value = item.name;
    this._close();
  }
}
